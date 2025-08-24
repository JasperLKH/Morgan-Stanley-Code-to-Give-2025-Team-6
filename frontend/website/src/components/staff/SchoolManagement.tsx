import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { School, Trash, Users, Download } from "lucide-react";

interface GeneratedAccount {
  username: string;
  password: string;
  role: string;
}

export function SchoolManagement() {
  // Helper to download CSV for generated accounts
  const downloadGeneratedCSV = (schoolName: string) => {
    const accounts = generatedAccounts[schoolName] || [];
    if (accounts.length === 0) return;
    const header = ['Username', 'Password', 'Role'];
    const rows = accounts.map(acc => [acc.username, acc.password, acc.role]);
    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schoolName.replace(/\s+/g, '_')}_generated_accounts.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };
  const [schools, setSchools] = useState<{ id: number; name: string }[]>([]);
  const [schoolName, setSchoolName] = useState("");
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const [generatedAccounts, setGeneratedAccounts] = useState<
    Record<string, GeneratedAccount[]>
  >({});

  // Load schools
  const fetchSchools = async () => {
    const res = await fetch("http://localhost:8000/account/schools/");
    const data = await res.json();
    setSchools(data.schools || []);
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleCreateSchool = async () => {
    if (!schoolName.trim()) return;
    const confirmed = window.confirm(`Are you sure you want to create the school "${schoolName}"?`);
    if (!confirmed) return;
    const res = await fetch("http://localhost:8000/account/schools/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: schoolName }),
    });
    if (res.ok) {
      await fetchSchools();
      setSchoolName("");
    }
  };

  const handleUpdateSchool = async (id: number, oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) return;
    await fetch(
      `http://localhost:8000/account/schools/${encodeURIComponent(oldName)}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      }
    );
    await fetchSchools();
  };

  const handleDeleteSchool = async (schoolName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the school "${schoolName}"? This will also delete all users in this school. This action cannot be undone.`);
    if (!confirmed) return;
    // delete all users first
    await fetch(
      `http://localhost:8000/account/schools/${encodeURIComponent(
        schoolName
      )}/users/delete-all/`,
      { method: "DELETE" }
    );
    // then delete school
    await fetch(
      `http://localhost:8000/account/schools/${encodeURIComponent(
        schoolName
      )}/`,
      { method: "DELETE" }
    );
    await fetchSchools();
  };

  const handleGenerateAccounts = async (
    schoolName: string,
    role: string,
    number: number
  ) => {
    if (!number || number <= 0) return;
    const confirmed = window.confirm(`Are you sure you want to generate ${number} ${role} accounts for "${schoolName}"? This action cannot be undone.`);
    if (!confirmed) return;
    setGenerating((prev) => ({ ...prev, [schoolName]: true }));

    try {
      const res = await fetch("http://localhost:8000/account/generate_accounts_by_school/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_name: schoolName,
          role,
          number,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate accounts");
      const data = await res.json();

      // save generated accounts to display
      setGeneratedAccounts((prev) => ({
        ...prev,
        [schoolName]: data.accounts || [], // expect backend returns { accounts: [ {username, password, role} ] }
      }));

      alert(`${number} ${role} accounts generated for ${schoolName}`);
    } catch (err) {
      console.error(err);
      alert("Error generating accounts");
    } finally {
      setGenerating((prev) => ({ ...prev, [schoolName]: false }));
    }
  };

  const handleDownloadCSV = async (schoolName: string) => {
    try {
      setDownloading((prev) => ({ ...prev, [schoolName]: true }));

      const res = await fetch(
        `http://localhost:8000/account/schools/${encodeURIComponent(
          schoolName
        )}/users/export/`
      );

      if (!res.ok) throw new Error("Failed to download CSV");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${schoolName.replace(/\s+/g, "_")}_accounts.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error downloading CSV");
    } finally {
      setDownloading((prev) => ({ ...prev, [schoolName]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Schools</h2>

      {/* Create School */}
      <Card>
        <CardHeader>
          <CardTitle>Create New School</CardTitle>
          <CardDescription>
            Enter the school name to create a new school
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="schoolName">School Name</Label>
          <Input
            id="schoolName"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
          />
          <Button onClick={handleCreateSchool}>
            <School className="h-4 w-4 mr-2" />
            Create School
          </Button>
        </CardContent>
      </Card>

      {/* Schools List */}
      {schools.map((s) => (
        <Card key={s.id} className="space-y-4">
          <CardContent className="flex flex-col gap-4 p-4">
            {/* Update + Delete Row */}
            <div className="flex items-center justify-between gap-4">
              <Input
                defaultValue={s.name}
                onBlur={(e) => handleUpdateSchool(s.id, s.name, e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleDownloadCSV(s.name)}
                  disabled={downloading[s.name]}
                >
                  <Download className="h-4 w-4 mr-1" />
                  {downloading[s.name] ? "Downloading..." : "Download CSV"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteSchool(s.name)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Bulk Generate Accounts */}
            <div className="flex items-center gap-2">
              <select
                id={`role-${s.id}`}
                className="border rounded p-1"
                defaultValue="parent"
              >
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
                <option value="staff">Staff</option>
              </select>
              <Input
                id={`number-${s.id}`}
                type="number"
                placeholder="Number"
                className="w-24"
              />
              <Button
                onClick={() => {
                  const role = (
                    document.getElementById(`role-${s.id}`) as HTMLSelectElement
                  ).value;
                  const number = parseInt(
                    (document.getElementById(`number-${s.id}`) as HTMLInputElement)
                      .value
                  );
                  handleGenerateAccounts(s.name, role, number);
                }}
                disabled={generating[s.name]}
              >
                <Users className="h-4 w-4 mr-2" />
                {generating[s.name] ? "Generating..." : "Generate Accounts"}
              </Button>
            </div>

            {/* Show generated accounts */}
            {generatedAccounts[s.name] && generatedAccounts[s.name].length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Generated Accounts</h4>
                  <Button
                    variant="secondary"
                    onClick={() => downloadGeneratedCSV(s.name)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download Newly Generated Accounts (CSV)
                  </Button>
                </div>
                <table className="w-full mt-2 border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">Username</th>
                      <th className="border px-2 py-1">Password</th>
                      <th className="border px-2 py-1">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedAccounts[s.name].map((acc, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{acc.username}</td>
                        <td className="border px-2 py-1">{acc.password}</td>
                        <td className="border px-2 py-1">{acc.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
