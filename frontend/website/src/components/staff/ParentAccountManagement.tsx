import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FamilyManagement } from "./FamilyManagement";
import { SchoolManagement } from "./SchoolManagement";

export default function ParentAccountManagement() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>
      <Tabs defaultValue="families" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="families">Users</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
        </TabsList>

        <TabsContent value="families">
          <FamilyManagement />
        </TabsContent>

        <TabsContent value="schools">
          <SchoolManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
