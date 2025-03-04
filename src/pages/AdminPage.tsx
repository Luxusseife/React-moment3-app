import { useAuth } from "../context/AuthContext"

const AdminPage = () => {

  const {user} = useAuth();

  return (
    <div>
      <h1>Välkommen, {user ? user.username : ""}!</h1>
    </div>
  )
}

export default AdminPage
