/*====================== FACADE PATTERN ======================*/
// Provides simplified interface to complex subsystems
// Common in: API layers, Service layers, Complex UI components

class APIFacade {
    constructor() {
        this.userAPI = new UserAPI();
        this.productAPI = new ProductAPI();
        this.orderAPI = new OrderAPI();
    }

    async getUserOrder(userId) {
        try {
            // Simplifies multiple API calls into one method
            const user = await this.userAPI.getUser(userId);
            const orders = await this.orderAPI.getUserOrders(userId);
            const products = await this.productAPI.getProductsByIds(
                orders.map(order => order.productId)
            );

            return {
                userDetails: user,
                orders: orders,
                products: products
            };
        } catch (error) {
            throw new Error('Error fetching user order details');
        }
    }
}

// Simulated APIs
class UserAPI {
    async getUser(id) {
        return { id, name: 'John Doe' };
    }
}

class ProductAPI {
    async getProductsByIds(ids) {
        return ids.map(id => ({ id, name: `Product ${id}` }));
    }
}

class OrderAPI {
    async getUserOrders(userId) {
        return [{ orderId: 1, productId: 123 }];
    }
}

module.exports = APIFacade; 