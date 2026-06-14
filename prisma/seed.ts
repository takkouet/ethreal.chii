import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@chiikawa.local";
  const password = process.env.ADMIN_PASSWORD || "chiikawa123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`Admin ready: ${email}`);

  // Map the original 4 seeded products to real chiikawamarket.jp photos
  // (downloaded to /public/market). Updates imageUrl in place — no deletes.
  const imageFixes: Record<string, string> = {
    "Chiikawa Plush": "/market/product1.jpg",
    "Hachiware Enamel Pin": "/market/product2.jpg",
    "Usagi Sticker Pack": "/market/product3.jpg",
    "Chiikawa Tote Bag": "/market/product4.jpg",
  };
  for (const [name, imageUrl] of Object.entries(imageFixes)) {
    await prisma.product.updateMany({ where: { name }, data: { imageUrl } });
  }

  // Additional real-photo products for a fuller grid (incl. sold-out for badges).
  const sampleProducts = [
    {
      name: "Chiikawa A5 Book Cover (Chiikawa)",
      description: "Protect your favourite notebook with a Chiikawa A5 book cover.",
      priceVnd: 380_000,
      imageUrl: "/market/product5.jpg",
      stock: 40,
    },
    {
      name: "Chiikawa A5 Book Cover (Hachiware)",
      description: "Hachiware A5 book cover. Soft pastel finish.",
      priceVnd: 380_000,
      imageUrl: "/market/product6.jpg",
      stock: 0,
    },
    {
      name: "Chiikawa Goods Set",
      description: "An assortment of small Chiikawa goods for good days and bad days.",
      priceVnd: 715_000,
      imageUrl: "/market/product7.jpg",
      stock: 25,
    },
    {
      name: "Chiikawa Connector Mini Fan",
      description: "A connectable mini fan featuring the Chiikawa gang.",
      priceVnd: 143_000,
      imageUrl: "/market/product8.jpg",
      stock: 60,
    },
  ];

  for (const p of sampleProducts) {
    const exists = await prisma.product.findFirst({ where: { name: p.name } });
    if (!exists) {
      await prisma.product.create({ data: p });
    }
  }
  console.log(
    `Fixed ${Object.keys(imageFixes).length} images, seeded ${sampleProducts.length} products.`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
