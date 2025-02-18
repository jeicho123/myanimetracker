import {auth, googleProvider} from "../config/firebase";
import {signInWithPopup, signOut} from "firebase/auth";
import { Button } from "@/components/ui/button";
export const Auth = () => {

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.log(err);
        }
    }

    const logout = async () => {
        await signOut(auth);
    }
    
    return (
        <div className="mt-8">
            <Button onClick={signInWithGoogle} variant="secondary">Sign in with Google</Button>
            <Button onClick={logout}>Logout</Button>
        
        </div>
    )
}

