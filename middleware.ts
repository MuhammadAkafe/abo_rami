import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CLIENT_ROUTES } from "./constans/constans";
import {clerkMiddleware,createRouteMatcher} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/client/sign-in(.*)',
    '/client/Unauthorized',
])

export default clerkMiddleware(async (auth, req) => {
    // If it's a public route, allow access
    if (isPublicRoute(req)) {
        return NextResponse.next();
    }
    return NextResponse.next();
});