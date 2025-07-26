/*
Ejercicio 2: Clases con Types
Implementa un sistema de usuarios con roles, usando herencia, interfaces y modificadores de acceso apropiados.
*/

class User {
    protected id: number;
    protected email: string;
    protected about: string;
    protected role: UserRole;

    constructor(id: number, email: string, about: string, role: UserRole) {
        this.id = id;
        this.email = email;
        this.about = about;
        this.role = role;
    }
}

type UserRole = "Guest" | "Maintainer" | "Admin";

interface ReadAccess {
    viewItems(): Set<string>;
    viewAnalytics(): [string, number][];
}

interface WriteAccess {
    addItem(item: string): void;
    deleteItem(item: string): void;
}

interface MemberManagement {
    addMember(id: number, email: string, about: string, role: UserRole): void;
    deleteMember(id: number): void;
}

class Guest extends User implements ReadAccess {
    protected items: Set<string>;
    protected analytics: [string, number][];
    constructor(id: number, email: string, about: string, role: UserRole) {
        super(id, email, about, "Guest");
        this.items = new Set<string>();
        this.analytics = [];
    }
    public viewItems(): Set<string> {
        return this.items;
    }
    public viewAnalytics(): [string, number][] {
        return this.analytics;
    }
}

class Maintainer extends Guest implements WriteAccess {
    constructor(id: number, email: string, about: string, role: UserRole) {
        super(id, email, about, "Maintainer");
    }
    public addItem(item: string): void {
        this.items.add(item);
    }
    public deleteItem(item: string): void {
        this.items.delete(item);
    }
}

class Admin extends Maintainer implements MemberManagement {
    private users: Map<number, User>;
    constructor(id: number, email: string, about: string, role: UserRole) {
        super(id, email, about, "Admin");
        this.users = new Map<number, User>();
    }
    public addMember(
        id: number,
        email: string,
        about: string,
        role: UserRole
    ): void {
        const newUser = new User(id, email, about, role);
        this.users.set(id, newUser);
    }
    public deleteMember(id: number): void {
        this.users.delete(id);
    }
}
