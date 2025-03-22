import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prismaClient = new PrismaClient();
dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());
prisma
  .$connect()
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.error("Failed to connect to the database:", error));
const PORT = 3001;

// POST endpoint to create test coupons
app.post("/create-coupon", async (req, res) => {
  const { code, status } = req.body;

  try {
    const newCoupon = await prismaClient.coupon.create({
      data: {
        code: code,
        status: status || true,
      },
    });
    res
      .status(201)
      .json({ message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create coupon" });
  }
});

// Middleware to check if user IP or session has already claimed a coupon
const checkClaimed = async (req, res, next) => {
  const { userIp, userSession } = req.body;

  if (!userIp && !userSession) {
    return res.status(400).json({ message: "IP or Session is required." });
  }

  const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours
  const existingClaim = await prisma.claim.findFirst({
    where: {
      OR: [
        {
          userIp: userIp,
          claimedAt: { gte: new Date(Date.now() - cooldownPeriod) },
        },
        {
          userSession: userSession,
          claimedAt: { gte: new Date(Date.now() - cooldownPeriod) },
        },
      ],
    },
  });

  if (existingClaim) {
    return res.status(403).json({
      message:
        "You have already claimed a coupon recently. Please try again later.",
    });
  }

  next();
};

// Route to get all available coupons
app.get("/coupons", async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      where: {
        status: true,
      },
    });
    res.json(coupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving coupons" });
  }
});

// Route to claim a coupon (Round-Robin distribution)
app.post("/claim", checkClaimed, async (req, res) => {
  const { userIp, userSession } = req.body;

  const coupon = await prisma.coupon.findFirst({
    where: { status: true },
    orderBy: { id: "asc" },
  });

  if (!coupon) {
    return res.status(404).json({ message: "No coupons available" });
  }

  await prisma.coupon.update({
    where: { id: coupon.id },
    data: { status: false },
  });

  await prisma.claim.create({
    data: {
      couponId: coupon.id,
      userIp: userIp,
      userSession: userSession,
    },
  });

  res.json({
    message: "Coupon successfully claimed!",
    couponCode: coupon.code,
  });
});

// Admin login
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await prisma.admin.findUnique({
    where: { username: username },
  });

  if (!admin || admin.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
});

// Admin view all coupons
app.get("/admin/coupons", async (req, res) => {
  console.log("GET /admin/coupons request received"); // Log the request
  try {
    const coupons = await prisma.coupon.findMany();
    res.json(coupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving coupons" });
  }
});

// Admin add new coupon
app.post("/admin/coupons", async (req, res) => {
  console.log("POST /admin/coupons request received", req.body); // Log the request
  const { code, status } = req.body;

  try {
    const newCoupon = await prisma.coupon.create({
      data: {
        code: code,
        status: status || true,
      },
    });
    res
      .status(201)
      .json({ message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create coupon" });
  }
});
// Admin update coupon status
app.put("/admin/coupons/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedCoupon = await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: { status: status },
    });
    res.json({ message: "Coupon updated successfully", coupon: updatedCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update coupon" });
  }
});

// Admin view all claims
app.get("/admin/claims", async (req, res) => {
  try {
    const claims = await prisma.claim.findMany({
      include: {
        coupon: true,
      },
    });
    res.json(claims);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving claims" });
  }
});
// Admin update coupon code
app.put("/admin/coupons/:id/code", async (req, res) => {
  const { id } = req.params;
  const { code } = req.body;

  try {
    const updatedCoupon = await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: { code: code },
    });
    res.json({
      message: "Coupon code updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update coupon code" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
