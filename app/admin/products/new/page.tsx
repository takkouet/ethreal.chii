import { AdminNav } from "@/components/admin-nav";
import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  return (
    <>
      <AdminNav />
      <h1 className="text-3xl font-bold mb-6">New product</h1>
      <ProductForm />
    </>
  );
}
