import { Role } from "@/interfaces/roles";

export interface RoleState {
    roles: any;
    rolesDropdown: any;
    currentRole?: Role | null;
    error:string | null;
    loading: boolean;
}