import { FC, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "styles/[username].module.css";

interface ProfileData {
  username: string;
  age: number;
  twitter: string;
  email: string;
  birthday: string;
  bio: string;
}

interface Props {
  profileData: ProfileData;
}

const UserProfile: FC = () => {
  const [liked, setLiked] = useState(false);
  const router = useRouter();
  const { username } = router.query;

  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    age: 0,
    twitter: "",
    email: "",
    birthday: "",
    bio: "",
  });
  
  const handleLike = () => {
    if (!profileData) return; // Add check for profileData
  
    const newLiked = !liked;
    setLiked(newLiked);
  
    const likedUsersStr = localStorage.getItem("likedUsers");
    if (likedUsersStr) {
      const likedUsers = JSON.parse(likedUsersStr);
      localStorage.setItem(
        "likedUsers",
        JSON.stringify({ ...likedUsers, [profileData.username]: newLiked })
      );
    }
  };
  
  useEffect(() => {
    if (!profileData) return;
  
    const likedUsersStr = localStorage.getItem("likedUsers");
    if (likedUsersStr) {
      const likedUsers = JSON.parse(likedUsersStr);
      setLiked(likedUsers[profileData.username] || false);
    }
  }, [profileData]);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const likedUsersStr = localStorage.getItem("likedUsers");
    if (likedUsersStr) {
      const likedUsers = JSON.parse(likedUsersStr);
      setLiked(likedUsers[profileData.username] || false);
    }
  }, [profileData]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`/api/profile/${username}`);
        const data = await res.json();
        setProfileData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileData();
  }, [username]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const props: Props = {
    profileData,
  };

  const imagePath = `/users/${username}.png`;

  const handleTwitterClick = () => {
    window.open(`https://twitter.com/${profileData.twitter}`, "_blank");
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <Profile {...props} imagePath={imagePath} handleBack={handleBack} handleLike={handleLike} liked={liked} handleTwitterClick={handleTwitterClick} />
    </div>
  );
};

const Profile: FC<Props & { imagePath: string, handleBack: () => void, handleLike: () => void, liked: boolean, handleTwitterClick: () => void }> = ({ profileData, imagePath, handleBack, handleLike, liked, handleTwitterClick }) => {
  const { username, bio, age, twitter, email, birthday } = profileData;

  return (
    <div className={`max-w-2xl w-full p-8 bg-white shadow-lg rounded-lg ${styles.container}`}>
      <div className="flex flex-col items-center justify-center mt-8">
        <div className="w-36 h-36 relative">
   <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <svg
            className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
          >
            <path
              fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9089FC" />
                <stop offset={1} stopColor="#FF80B5" />
              </linearGradient>
            </defs>
          </svg>
        </div>       
        <Image
            src={imagePath}
            alt={`Profile picture of ${username}`}
            layout="fill"
            className={`rounded-full ${styles.profileImage}`}
          />
        </div>
        <div className={`text-3xl font-bold mt-4 ${styles.username}`}>{username}</div>
        <div className={`text-gray-600 mt-2 ${styles.age}`}>{age}</div>
        <div className={`text-gray-600 mt-2 ${styles.twitter}`} onClick={handleTwitterClick}>Twitter: {twitter}</div>
        <div className={`text-gray-600 mt-2 ${styles.email}`} onClick={() => window.location.href = `mailto:${email}`} >
          {email}
        </div>
        <div className={`text-gray-600 mt-2 ${styles.birthday}`}>Birthday: {birthday}</div>
        <div className={`text-gray-600 mt-2 ${styles.bio}`}>{bio}</div>
        <div className="flex items-center justify-between w-full mt-4">
          <button
            className={`${styles.button} text-gray-600 hover:text-gray-900 focus:outline-none`}
            onClick={handleBack}
          >
            Back
          </button>
          <div
            className={`text-gray-600 flex items-center space-x-1 ${
              liked ? "text-red-500" : ""
            }`}
          >
            <button
              className={`${styles.button} ${liked ? styles.likedButton : styles.likeButton}`}
              onClick={handleLike}
            >
              {liked ? "Liked" : "Like"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
