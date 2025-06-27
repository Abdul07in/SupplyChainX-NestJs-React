import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';

@Injectable()
export class EventListeners {
  private readonly logger = new Logger(EventListeners.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('product.created')
  async handleProductCreated(product: any) {
    this.logger.log(`Product created: ${product.name} (${product.sku})`);
    
    // Send notification to relevant stakeholders
    await this.notificationsService.sendEmail(
      'inventory@company.com',
      'New Product Added',
      `A new product "${product.name}" has been added to the inventory.`,
    );
  }

  @OnEvent('stock.low')
  async handleLowStock(product: any) {
    this.logger.warn(`Low stock alert for product: ${product.name} (${product.stockQuantity} remaining)`);
    
    // Send low stock alert
    await this.notificationsService.sendEmail(
      'procurement@company.com',
      'Low Stock Alert',
      `Product "${product.name}" is running low on stock. Current quantity: ${product.stockQuantity}`,
    );
  }

  @OnEvent('purchase-order.created')
  async handlePurchaseOrderCreated(purchaseOrder: any) {
    this.logger.log(`Purchase order created: ${purchaseOrder.orderNumber}`);
    
    // Notify supplier
    if (purchaseOrder.supplier?.email) {
      await this.notificationsService.sendEmail(
        purchaseOrder.supplier.email,
        'New Purchase Order',
        `You have received a new purchase order: ${purchaseOrder.orderNumber}`,
      );
    }
  }

  @OnEvent('sales-order.created')
  async handleSalesOrderCreated(salesOrder: any) {
    this.logger.log(`Sales order created: ${salesOrder.orderNumber}`);
    
    // Send order confirmation
    await this.notificationsService.sendEmail(
      'sales@company.com',
      'New Sales Order',
      `A new sales order has been created: ${salesOrder.orderNumber}`,
    );
  }

  @OnEvent('shipment.status.updated')
  async handleShipmentStatusUpdated(shipment: any) {
    this.logger.log(`Shipment status updated: ${shipment.trackingNumber} - ${shipment.status}`);
    
    // Notify relevant parties about shipment status change
    await this.notificationsService.sendEmail(
      'logistics@company.com',
      'Shipment Status Update',
      `Shipment ${shipment.trackingNumber} status has been updated to: ${shipment.status}`,
    );
  }
}