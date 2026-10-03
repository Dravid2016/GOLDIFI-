/**
 * Goldifi Employee & Custom Role Service
 */

import { MOCK_EMPLOYEES } from '../mock/employees';
import { Employee, Permission, RoleType } from '../types';

class EmployeeService {
  private employees: Employee[] = [...MOCK_EMPLOYEES];

  async getEmployees(): Promise<Employee[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [...this.employees];
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    await new Promise((r) => setTimeout(r, 150));
    return this.employees.find((e) => e.id === id) || null;
  }

  async updateEmployeePermissions(id: string, permissions: Permission[]): Promise<Employee | null> {
    await new Promise((r) => setTimeout(r, 250));
    const idx = this.employees.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    this.employees[idx] = {
      ...this.employees[idx],
      permissions: [...permissions],
    };
    return this.employees[idx];
  }

  async toggleEmployeeStatus(id: string): Promise<Employee | null> {
    await new Promise((r) => setTimeout(r, 200));
    const idx = this.employees.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    this.employees[idx] = {
      ...this.employees[idx],
      status: this.employees[idx].status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
    };
    return this.employees[idx];
  }

  async createEmployee(data: {
    name: string;
    email: string;
    phone: string;
    role: RoleType;
    customRoleTitle?: string;
    branchId: string;
    branchName: string;
    permissions: Permission[];
  }): Promise<Employee> {
    await new Promise((r) => setTimeout(r, 300));
    const nextCode = `EMP-00${this.employees.length + 1}`;
    const newEmp: Employee = {
      id: `emp-0${this.employees.length + 1}`,
      employeeCode: nextCode,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      customRoleTitle: data.customRoleTitle,
      branchId: data.branchId,
      branchName: data.branchName,
      status: 'ACTIVE',
      permissions: data.permissions,
      dataScope: data.role === 'OWNER' ? 'ALL_BRANCHES' : 'MY_BRANCH',
      joinedDate: new Date().toISOString(),
      lastActive: 'Just now',
    };

    this.employees.push(newEmp);
    return newEmp;
  }
}

export const employeeService = new EmployeeService();
