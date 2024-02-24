import { Roles } from "../constants";

export function isEmployee(role) {
    return role === Roles.Employee;
}

export function isAdmin(role) {
    return role === Roles.Admin;
}

export function isSafetyWarden(role) {
    return role === Roles.SafetyWarden;
}

export function isPrivilleged(role) {
    return isAdmin(role) || isSafetyWarden(role);
}
