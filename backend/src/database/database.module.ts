import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities
import { User } from '../modules/users/entities/user.entity';
import { Product } from '../modules/products/entities/product.entity';
import { Supplier } from '../modules/suppliers/entities/supplier.entity';
import { PurchaseOrder } from '../modules/purchase-orders/entities/purchase-order.entity';
import { PurchaseOrderItem } from '../modules/purchase-orders/entities/purchase-order-item.entity';
import { SalesOrder } from '../modules/sales-orders/entities/sales-order.entity';
import { SalesOrderItem } from '../modules/sales-orders/entities/sales-order-item.entity';
import { InventoryItem } from '../modules/warehouse/entities/inventory-item.entity';
import { StockMovement } from '../modules/warehouse/entities/stock-movement.entity';
import { Shipment } from '../modules/shipments/entities/shipment.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [
          User,
          Product,
          Supplier,
          PurchaseOrder,
          PurchaseOrderItem,
          SalesOrder,
          SalesOrderItem,
          InventoryItem,
          StockMovement,
          Shipment,
        ],
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
        ssl: configService.get('database.ssl'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}