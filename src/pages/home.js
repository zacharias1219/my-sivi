import Navbar from '@/components/navbar';
import { useUsers } from '@/context/UsersContext';
import toLogin from '@/hoc/toLogin';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import Type from '@/components/Type';
import { useState, useEffect } from 'react';
import Image from "next/image";

function Home() {
  const router = useRouter();
  const { users, setUsers, currentUser, setCurrentUser } = useUsers();

  const handleUserClick = (user) => {
    if (!currentUser) {
      console.log("Current user is not set, cannot proceed.");
      return;
    }
    const channelId = user._id;
    const joiningUserInfo = {
      email: currentUser.email,
      profilePicture: currentUser.profilePicture,
      id: currentUser.id,
    };
    console.log('Joining user:', joiningUserInfo);
    router.push(`/channel/${channelId}?id=${joiningUserInfo.id}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Starting to fetch users...");
        const response = await fetch('/api/getallusers');
        if (response.ok) {
          const usersResponse = await response.json();
          console.log("Fetched users successfully:", usersResponse);
          setUsers(usersResponse); // Set users here
        } else {
          console.log("Failed to fetch users");
        }
      } catch (err) {
        console.log("Failed to fetch users", err);
      }
    };

    fetchUsers();

    // Check for token in localStorage
    const token = localStorage.getItem('token');
    console.log("Token retrieved from localStorage:", token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);
        if (decodedToken && decodedToken.email) {
          setCurrentUser(decodedToken);
          console.log("Current user set:", decodedToken);
        } else {
          console.log("Decoded token does not contain an email");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [setUsers, setCurrentUser]);

  const sortedUsers = [...(users || [])].sort((a, b) => {
    if (currentUser && a.email === currentUser.email) return -1;
    if (currentUser && b.email === currentUser.email) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow p-4 space-y-4">
        <div className='pt-10 px-10'>
          <div className="bg-blue-900 text-black rounded-3xl p-8 mb-8">
            <div className="flex flex-col md:flex-row text-center bg-white rounded-2xl font-nunito p-3 justify-between items-center mb-8">
              <h1 className="text-2xl font-bold mb-4 md:mb-0">Welcome to MySivi</h1>
              <button className="text-blue-900 text-xl rounded-full px-4 py-2">
                Select Mode
              </button>
            </div>
            <div className="flex items-center justify-center text-center pt-7 pb-7 flex-col md:flex-row font-nunito space-y-10 md:space-y-0 md:space-x-4">
              <Type heading="Talk with a Person" description="AI Bot As Moderator" link="/channel" img="/person.png" w="200" h="150"/>
              <Type heading="Talk with AI Bot" description="AI bot will roleplay and talk with you." link="" img="/robot.jpg" w="200" h="150"/>
            </div>
          </div>
        </div>
        <div className='px-10 flex flex-col md:flex-row gap-4 items-center justify-center'>
          <section className="bg-yellow-500 p-4 rounded-3xl">
            <h2 className="font-bold text-3xl mb-2">Active Users</h2>
            <div className="items-start gap-4">
              {sortedUsers.map((user) => (
                <div key={user._id} className="flex flex-col items-start">
                  <button
                    onClick={() => handleUserClick(user)}
                    className="flex flex-col items-center focus:outline-none"
                  >
                    <div className='flex flex-row'>
                      <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 overflow-hidden hover:opacity-80 transition-opacity">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-lg text-center pl-3 pt-5 hover:underline">
                        {user.email === currentUser?.email ? 'You' : user.username}
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-yellow-500 text-black rounded-xl p-4 font-nunito flex flex-row items-center w-[600px] h-[400px] justify-center">
            <div className="flex flex-col items-start max-w-80">
              <h2 className="text-4xl font-bold mb-4">Your Friends</h2>
              <p className="text-5xl">You have No friends yet</p>
            </div>
            <Image
              src="/illustrationvi-2@2x.png"
              alt="Sad face avatar"
              className="mb-4 h-52"
              width={200}
              height={150}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

// export default toLogin(Home);
export default Home;
