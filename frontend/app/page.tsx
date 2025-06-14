import { getServerSession } from "next-auth"
import LogoutButton from "@/components/LogoutButton";
import { authOptions } from "./api/auth/options";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {session ? (
        <div>
          <p>Logged in as: {session.user?.full_name}</p>
          <p>Email: {session.user?.email}</p>
          <p>Role: {session.user?.role}</p>
          <p>AccessToken: {session.accessToken}</p>
          <LogoutButton />
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  )
}
