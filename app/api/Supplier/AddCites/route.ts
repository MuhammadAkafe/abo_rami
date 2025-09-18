import { NextResponse } from "next/server";
import { prisma } from "@/app/(lib)/prisma";
import { City } from "@/app/(types)/types";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cities, supplier_id } = body;

        if (!supplier_id) {
            return NextResponse.json({error: "Supplier ID is required"}, {status: 400});
        }
        if (!cities) {
            return NextResponse.json({error: "Cities are required"}, {status: 400});
        }
        const id = await prisma.suppliers.findUnique({
            where: { id: supplier_id },
            select: { userid: true }
        });
        if (!id) {
            return NextResponse.json({error: "User not found"}, {status: 400});
        }

        const existingCities = await prisma.cities.findMany({
            where: {
                city: {
                    in: cities.map((city: City) => city.name)
                },
                userid: id.userid,
                supplierid: supplier_id,
            }
        });
        if (existingCities.length > 0) 
            {
            return NextResponse.json({error: "Cities already exist"}, {status: 400});
        }

        const newCities = await prisma.cities.createMany(
            {
            data: cities.map((city: City) => ({
                city: city.name,
                userid: id.userid,
                supplierid: supplier_id,
            })),
        });
        return NextResponse.json({message: "Cities added successfully", cities});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Failed to add cities"}, {status: 500});
    }
}