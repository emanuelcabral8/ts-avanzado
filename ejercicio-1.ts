/*
Ejercicio 1: Utility Types
Crea un sistema de gestión de productos que use Partial, Pick y Omit para diferentes operaciones ABM.
*/

interface Product {
    readonly id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    inStock: boolean;
    quantity: number;
}
type PartialProduct = Omit<Partial<Product>, "id">;
type RequiredProductInfo = Pick<Product, "id" | "name" | "category" | "price">;

interface ProductManagement {
    newProduct(productData: RequiredProductInfo): void;
    updateProduct(id: number, updates: PartialProduct): void;
    deleteProduct(id: number): void;
}

class System implements ProductManagement {
    private data: Map<number, Product>;
    constructor() {
        this.data = new Map<number, Product>();
    }
    public newProduct(productData: RequiredProductInfo): void {
        const defaultInfo = {
            price: 0,
            inStock: true,
            quantity: 0,
            description: "",
        };
        const product = { ...productData, ...defaultInfo };
        this.data[productData.id] = product;
    }
    public updateProduct(id: number, updates: PartialProduct): void {
        this.data.set(id, { ...this.data[id], ...updates });
    }
    public deleteProduct(id: number): void {
        this.data.delete(id);
    }
}
