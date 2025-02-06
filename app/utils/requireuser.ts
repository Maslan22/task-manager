import { redirect } from "next/navigation";
import { auth } from "./auth";

export const requireUser = async() => {
    const user = await auth();

    if(!user) {
        return redirect("/login");
    }

    return user;
 }