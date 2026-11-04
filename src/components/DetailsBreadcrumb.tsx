import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface DetailsBreadcrumbProps {
  parentLabel: string;
  parentTo: string;
  masters?: boolean;
  label?: string;
}

const DetailsBreadcrumb = ({
  parentLabel,
  parentTo,
  masters = false,
  label = "Details",
}: DetailsBreadcrumbProps) => (
  <Breadcrumb className="mb-4 print:hidden">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      {masters && (
        <>
          <BreadcrumbItem>
            <span className="font-medium">Masters</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </>
      )}
      <BreadcrumbItem>
        <BreadcrumbLink to={parentTo}>{parentLabel}</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>{label}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

export default DetailsBreadcrumb;
