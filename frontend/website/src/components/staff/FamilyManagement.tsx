import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Search, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface User {
  id: number;
  username: string;
  role: string;
  parent_name?: string | null;
  children_name?: string | null;
  teacher_name?: string | null;
  staff_name?: string | null;
  is_active: boolean;
  school: string;
}

export function FamilyManagement() {
  const [schools, setSchools] = useState<{ id: number; name: string }[]>([]);
  const [usersBySchool, setUsersBySchool] = useState<Record<string, User[]>>({});
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch schools first
  useEffect(() => {
    fetch("http://localhost:8000/account/schools/")
      .then((res) => res.json())
      .then((data) => setSchools(data.schools || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const fetchUsers = async (schoolName: string, role: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/account/schools/${encodeURIComponent(
          schoolName
        )}/users/?role=${role}`
      );
      const data = await res.json();
      setUsersBySchool((prev) => ({ ...prev, [schoolName]: data.users }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivate = async (userId: number, school: string) => {
    await fetch("http://localhost:8000/account/users/activate/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    setUsersBySchool((prev) => ({
      ...prev,
      [school]: prev[school].map((u) =>
        u.id === userId ? { ...u, is_active: true } : u
      ),
    }));
  };

  const handleDeactivate = async (userId: number, school: string) => {
    await fetch("http://localhost:8000/account/users/deactivate/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    setUsersBySchool((prev) => ({
      ...prev,
      [school]: prev[school].map((u) =>
        u.id === userId ? { ...u, is_active: false } : u
      ),
    }));
  };

  const handleUpdateName = async (
    userId: number,
    role: string,
    newName: string,
    school: string
  ) => {
    const body: any = { user_id: userId };
    if (role === "parent") body.parent_name = newName;
    if (role === "teacher") body.teacher_name = newName;
    if (role === "staff") body.staff_name = newName;

    await fetch("http://localhost:8000/account/users/update-name/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setUsersBySchool((prev) => ({
      ...prev,
      [school]: prev[school].map((u) =>
        u.id === userId
          ? {
              ...u,
              parent_name: role === "parent" ? newName : u.parent_name,
              teacher_name: role === "teacher" ? newName : u.teacher_name,
              staff_name: role === "staff" ? newName : u.staff_name,
            }
          : u
      ),
    }));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Users</h2>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {schools.map((school) => {
        const schoolName = school.name;
        const users = usersBySchool[schoolName] || [];
        const role = roleFilter[schoolName] || "parent";

        // Split active/inactive
        const activeUsers = users.filter((u) => u.is_active);
        const inactiveUsers = users.filter((u) => !u.is_active);

        return (
          <div key={school.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{schoolName}</h3>
              <select
                value={role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setRoleFilter((prev) => ({
                    ...prev,
                    [schoolName]: newRole,
                  }));
                  fetchUsers(schoolName, newRole);
                }}
                className="border rounded p-1"
              >
                <option value="parent">Parents</option>
                <option value="teacher">Teachers</option>
              </select>
            </div>

            {[...activeUsers, ...inactiveUsers]
              .filter((account) => {
                const namesToSearch = [
                  account.parent_name,
                  account.teacher_name,
                  account.staff_name,
                  account.children_name
                ].filter(Boolean).join(" ");
                return namesToSearch
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
              })
              .map((account) => {
                const displayName =
                  account.parent_name ||
                  account.teacher_name ||
                  account.staff_name ||
                  "Unnamed";

                return (
                  <Card key={account.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {displayName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <Input
                              defaultValue={displayName}
                              onBlur={(e) =>
                                handleUpdateName(
                                  account.id,
                                  account.role,
                                  e.target.value,
                                  schoolName
                                )
                              }
                            />
                            {account.role === "parent" && (
                              <p className="text-sm text-gray-600">
                                Child: {account.children_name || "N/A"}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Role: {account.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <Badge
                            variant={
                              account.is_active ? "default" : "secondary"
                            }
                            className={account.is_active ? "bg-green-500" : ""}
                          >
                            {account.is_active ? "active" : "inactive"}
                          </Badge>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {account.is_active ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeactivate(account.id, schoolName)
                                  }
                                >
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleActivate(account.id, schoolName)
                                  }
                                >
                                  Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}
