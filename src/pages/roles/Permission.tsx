import Checkbox from "@/components/CheckBox";
import Input from "@/components/input";
import { sidebarItems } from "@/components/Sidebar";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import View from "@/components/view";
import { Permissions } from "@/interfaces/roles";
import { useEffect, useState } from "react";

const PermissionPage: React.FC<{}> = () => {
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState<Permissions[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const demoData = [
    { view: true, add: true, edit: true, delete: true },
    { view: true, add: true, edit: true, delete: false },
    { view: true, add: true, edit: false, delete: false },
    { view: true, add: true, edit: true, delete: false },
    { view: true, add: true, edit: false, delete: false },
    { view: true, add: true, edit: true, delete: false },
    { view: true, add: true, edit: false, delete: false },
  ];

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const data = await demoData;
        setPermissions(data);
      } catch (err:unknown) {
        console.error(err)
        // setError("Failed to load permissions");
      }
      // setLoading(false);
    };

    loadPermissions();
  }, []);

  const isAllChecked = permissions.every(
    (perm) => perm.view && perm.add && perm.edit && perm.delete
  );

  const handleSelectAll = (checked: boolean) => {
    const updated = permissions.map((perm) => ({
      ...perm,
      view: checked,
      add: checked,
      edit: checked,
      delete: checked,
    }));
    setPermissions(updated);
  };

  const handleCheckboxChange = (
    index: number,
    field: "view" | "add" | "edit" | "delete",
    checked: boolean
  ) => {
    const updated = [...permissions];
    updated[index][field] = checked;
    setPermissions(updated);
  };

  return (
    <>
      <View className="mb-6 flex justify-between items-center">
        <View>
          <Text as="h1" className="text-2xl font-bold text-text-DEFAULT mb-1">
            Permissions
          </Text>
          <Text as="p" className="text-text-light">
            View all Permissions
          </Text>
        </View>
        <View className="flex gap-4 items-center">
          <Input
            name="role"
            value={role}
            disabled={true}
            placeholder="role"
            onChange={(e) => setRole(e.target.value)}
          />
          <View className="flex gap-2 items-center">
            <Text as="h4" className="text-text-DEFAULT">
              Select All
            </Text>
            <Checkbox
              checked={isAllChecked}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </View>
        </View>
      </View>
      <Card className="overflow-hidden">
        <DynamicTable
          tableHeaders={["Role", "View", "Add", "Edit", "Delete"]}
          tableData={permissions?.map((item, index) => [
            sidebarItems[index]?.label,
            <Checkbox
              checked={item.view}
              onChange={(e) =>
                handleCheckboxChange(index, "view", e.target.checked)
              }
            />,
            <Checkbox
              checked={item.add}
              onChange={(e) =>
                handleCheckboxChange(index, "add", e.target.checked)
              }
            />,
            <Checkbox
              checked={item.edit}
              onChange={(e) =>
                handleCheckboxChange(index, "edit", e.target.checked)
              }
            />,
            <Checkbox
              checked={item.delete}
              onChange={(e) =>
                handleCheckboxChange(index, "delete", e.target.checked)
              }
            />,
          ])}
        />
      </Card>
    </>
  );
};

export default PermissionPage;
