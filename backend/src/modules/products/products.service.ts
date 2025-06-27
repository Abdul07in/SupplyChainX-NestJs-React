import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);

    // Emit event for product creation
    this.eventEmitter.emit('product.created', savedProduct);

    return savedProduct;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.supplier', 'supplier');

    if (search) {
      queryBuilder.where(
        'product.name ILIKE :search OR product.sku ILIKE :search OR product.category ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (sortBy) {
      queryBuilder.orderBy(`product.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    const [products, totalCount] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      products,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);

    // Emit event for product update
    this.eventEmitter.emit('product.updated', updatedProduct);

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);

    // Emit event for product deletion
    this.eventEmitter.emit('product.deleted', { id, product });
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stockQuantity = quantity;
    
    const updatedProduct = await this.productRepository.save(product);

    // Emit stock update event
    this.eventEmitter.emit('stock.updated', {
      productId: id,
      oldQuantity: product.stockQuantity,
      newQuantity: quantity,
    });

    // Check for low stock
    if (quantity < 20) {
      this.eventEmitter.emit('stock.low', updatedProduct);
    }

    return updatedProduct;
  }
}