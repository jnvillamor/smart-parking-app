import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log("Session:", session);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {session ? (
        <div>
          <p>Logged in as: {session.user?.full_name}</p>
          <p>Email: {session.user?.email}</p>
          <p>Role: {session.user?.role}</p>
          <LogoutButton />
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  )
}
