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

export function UserAccountManagement() {
  const [schools, setSchools] = useState<Array<string | { id: string; name: string }>>([]);
  const [usersBySchool, setUsersBySchool] = useState<Record<string, User[]>>({});
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch list of schools first
  useEffect(() => {
    fetch("http://localhost:8000/account/schools/")
      .then((res) => res.json())
      .then((data) => {
        // Support both array of strings and array of objects
        setSchools(data.schools || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch users by school + role filter
  const fetchUsers = async (school: string, role: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/account/schools/${encodeURIComponent(
          school
        )}/users/?role=${role}`
      );
      const data = await res.json();
      setUsersBySchool((prev) => ({ ...prev, [school]: data.users }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivate = async (userId: number, school: string) => {
    try {
      const res = await fetch("http://localhost:8000/account/users/activate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to activate user");
      setUsersBySchool((prev) => ({
        ...prev,
        [school]: prev[school].map((u) =>
          u.id === userId ? { ...u, is_active: true } : u
        ),
      }));
    } catch (err) {
      console.error(err);
      alert("Error activating user");
    }
  };

  const handleDeactivate = async (userId: number, school: string) => {
    try {
      const res = await fetch(
        "http://localhost:8000/account/users/deactivate/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      if (!res.ok) throw new Error("Failed to deactivate user");
      setUsersBySchool((prev) => ({
        ...prev,
        [school]: prev[school].map((u) =>
          u.id === userId ? { ...u, is_active: false } : u
        ),
      }));
    } catch (err) {
      console.error(err);
      alert("Error deactivating user");
    }
  };

  const handleUpdateName = async (
    userId: number,
    role: string,
    newName: string,
    school: string
  ) => {
    try {
      const body: any = { user_id: userId };
      if (role === "parent") body.parent_name = newName;
      if (role === "teacher") body.teacher_name = newName;
      if (role === "staff") body.staff_name = newName;

      const res = await fetch(
        "http://localhost:8000/account/users/update-name/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error("Failed to update name");

      setUsersBySchool((prev) => ({
        ...prev,
        [school]: prev[school].map((u) =>
          u.id === userId
            ? {
                ...u,
                parent_name:
                  role === "parent" ? newName : u.parent_name,
                teacher_name:
                  role === "teacher" ? newName : u.teacher_name,
                staff_name: role === "staff" ? newName : u.staff_name,
              }
            : u
        ),
      }));
    } catch (err) {
      console.error(err);
      alert("Error updating name");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">User Account Management</h2>

      {/* Search across all schools */}
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

      {schools.map((schoolObjOrStr) => {
        // Support both string and object for school
        const schoolKey = typeof schoolObjOrStr === "string" ? schoolObjOrStr : schoolObjOrStr.id;
        const schoolName = typeof schoolObjOrStr === "string" ? schoolObjOrStr : schoolObjOrStr.name;
        return (
          <div key={schoolKey} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{schoolName}</h3>
              <select
                value={roleFilter[schoolKey] || ""}
                onChange={(e) => {
                  const role = e.target.value;
                  setRoleFilter((prev) => ({ ...prev, [schoolKey]: role }));
                  if (role === "") {
                    // Fetch all users for the school (no role filter)
                    fetch(`http://localhost:8000/account/schools/${encodeURIComponent(schoolName)}/users/`)
                      .then((res) => res.json())
                      .then((data) => setUsersBySchool((prev) => ({ ...prev, [schoolName]: data.users })))
                      .catch((err) => console.error(err));
                  } else {
                    fetchUsers(schoolName, role);
                  }
                }}
                className="border rounded p-1"
              >
                <option value="">Select</option>
                <option value="parent">Parents</option>
                <option value="teacher">Teachers</option>
              </select>
            </div>

            <div className="space-y-4">
              {(usersBySchool[schoolName] || [])
                // Filter by search term
                .filter((account) => {
                  const namesToSearch = [
                    account.parent_name,
                    account.teacher_name,
                    account.staff_name,
                    account.children_name
                  ].filter(Boolean).join(" ");
                  return namesToSearch.toLowerCase().includes(searchTerm.toLowerCase());
                })
                // Sort: active first, inactive later
                .sort((a, b) => Number(b.is_active) - Number(a.is_active))
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
                              <p className="text-xs text-gray-500">
                                Role: {account.role}
                              </p>

                              {/* If parent, show child name */}
                              {account.role === "parent" && account.children_name && (
                                <p className="text-xs text-gray-400">
                                  Child: {account.children_name}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <Badge
                              variant={account.is_active ? "default" : "secondary"}
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
          </div>
        );
      })}
    </div>
  );
}
