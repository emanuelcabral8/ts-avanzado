/*
Ejercicio 3: Generic Types
Construye un sistema de cache genérico que pueda almacenar cualquier tipo de dato con TTL (time to live)
Utiliza una clase con métodos set, get y cleanup.
*/

interface cachedValue<T> {
    set value(v: T);
    set TTL(ttl: number);
    get value(): T;
    get TTL(): number;
}

class cachedValueImpl<T> implements cachedValue<T> {
    private _value: T;
    private _TTL: number;
    constructor(v: T, t: number) {
        this._value = v;
        this._TTL = t;
    }
    set value(v: T) {
        this._value = v;
    }
    set TTL(ttl: number) {
        this._TTL = ttl;
    }
    get value() {
        return this._value;
    }
    get TTL() {
        return this._TTL;
    }
}

interface CacheTTL<T> {
    addToCache(value: T, TTL: number): void;
    getActualTTL(v: T): number;
    earlyDeletion(v: T): void;
    cleanup(): void;
}

type Counter = { value: number }; // Envuelvo al valor en un objeto para que pueda actualizarse

class CacheTTLImpl<T> implements CacheTTL<T> {
    public data: Map<T, [Counter, cachedValueImpl<T>, NodeJS.Timeout]>;
    constructor() {
        this.data = new Map<T, [Counter, cachedValueImpl<T>, NodeJS.Timeout]>();
    }

    public addToCache(value: T, TTL: number): void {
        const newCachedValue: cachedValueImpl<T> = new cachedValueImpl(
            value,
            TTL
        );
        const counter = { value: 0 };
        const interval = setInterval(() => {
            counter.value++;
        }, 1000); // Implemento una variable que contiene los segundos desde que se agregó el valor

        this.data.set(value, [counter, newCachedValue, interval]);
    }
    public getActualTTL(v: T): number {
        if (!this.data.has(v)) {
            throw new Error("Value is not stored");
        } else {
            const temp: [Counter, cachedValueImpl<T>, NodeJS.Timeout] = this.data.get(v)!;
            const res: number = temp[0].value
            return res; // Devuelvo cuantos segundos pasaron desde que se agregó el valor
        }
    }
    public earlyDeletion(v: T): void {
        if (!this.data.has(v)) {
            throw new Error ("Value is not stored")
        } else {
            clearInterval(this.data.get(v)![2]) // Limpio el intervalo para evitar consumo excesivo de memoria
            this.data.delete(v)
        }
    }
    public cleanup(): void { // El limpiado es manual, podría implementarse que se limpie cada X tiempo
        this.data.forEach((value,key) => {
            if (value[0].value > value[1].TTL) {
                clearInterval(value[2])
                this.data.delete(key)
            }
        })
    }
}