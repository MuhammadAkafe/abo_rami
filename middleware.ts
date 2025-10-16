import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CLIENT_ROUTES } from "./app/constans/constans";
import {clerkMiddleware,createRouteMatcher} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    '/client/USER(.*)',
    '/client/ADMIN(.*)',
])

export default clerkMiddleware(async (auth,req) => {
    if(!isPublicRoute(req)) {
        const { userId } = await auth();
        if(!userId) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }
    return NextResponse.next();
});