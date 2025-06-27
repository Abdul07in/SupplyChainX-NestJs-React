import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.supplierRepository.create(createSupplierDto);
    const savedSupplier = await this.supplierRepository.save(supplier);

    // Emit event for supplier creation
    this.eventEmitter.emit('supplier.created', savedSupplier);

    return savedSupplier;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.supplierRepository.createQueryBuilder('supplier');

    if (search) {
      queryBuilder.where(
        'supplier.name ILIKE :search OR supplier.contactPerson ILIKE :search OR supplier.email ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (sortBy) {
      queryBuilder.orderBy(`supplier.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('supplier.createdAt', 'DESC');
    }

    const [suppliers, totalCount] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      suppliers,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);
    
    Object.assign(supplier, updateSupplierDto);
    const updatedSupplier = await this.supplierRepository.save(supplier);

    // Emit event for supplier update
    this.eventEmitter.emit('supplier.updated', updatedSupplier);

    return updatedSupplier;
  }

  async remove(id: string): Promise<void> {
    const supplier = await this.findOne(id);
    await this.supplierRepository.remove(supplier);

    // Emit event for supplier deletion
    this.eventEmitter.emit('supplier.deleted', { id, supplier });
  }
}