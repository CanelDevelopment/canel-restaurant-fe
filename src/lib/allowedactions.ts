export const permissionValues = [
  "add product",
  "add category",
  "add staff",
  "add bussiness hours",
  "add branch",
  "add addon",
  "add addon item",
  "add pos",
  "view product",
  "view category",
  "view staff",
  "view bussiness hours",
  "view branch",
  "view addon",
  "view addon item",
  "view order",
  "update product",
  "update category",
  "update staff",
  "update bussiness hours",
  "update branch",
  "update addon",
  "update addon item",
  "update order",
  "delete product",
  "delete category",
  "delete staff",
  "delete bussiness hours",
  "delete branch",
  "delete addon",
  "delete addon item",
  "delete order",
] as const;

export const formatPermissionLabel = (permission: string): string => {
  return permission
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
