import { FC, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "styles/Leaderboard.module.css";
import React from "react";

interface LeaderboardEntry {
  username: string;
  profileImage: string;
  liked: boolean;
  score: number;
}

const LeaderboardItem: FC<{
  entry: LeaderboardEntry;
  index: number;
  toggleLikedUser: (username: string) => void;
  style?: { boxShadow: string } | {};
}> = React.memo(({ entry, index, toggleLikedUser, style = {} }) => {
  const handleToggleLikedUser = useCallback(() => {
    toggleLikedUser(entry.username);
  }, [toggleLikedUser, entry.username]);

  return (
    <li
      key={`${entry.username}-${index}-${entry.liked}`}
      className={`${styles.listItem} ${index % 2 === 0 ? styles.evenItem : styles.oddItem}`}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ECECFC")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
      style={style}
    >
      <span className={styles.rank}>{index + 1}</span>
      <div className={styles.user}>
        <Link legacyBehavior href={`/profile/${encodeURIComponent(entry.username)}`}>
          <a className={styles.profileWrapper}>
            <img
              src={entry.profileImage}
              alt={`Profile picture of ${entry.username}`}
              className={styles.profileImage}
            />
          </a>
        </Link>
        <Link legacyBehavior href={`/profile/${encodeURIComponent(entry.username)}`}>
          <a className={styles.username}>{entry.username}</a>
        </Link>
      </div>
      <span className={styles.score}>{entry.score}</span>
      <div className={styles.actions}>
        <button
          className={`${styles.button} ${
            entry.liked ? styles.likedButton : styles.likeButton
          }`}
          onClick={handleToggleLikedUser}
        >
          {entry.liked ? "Liked" : "Like"}
        </button>
      </div>
    </li>
  );
});

const Leaderboard: FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [likedUsers, setLikedUsers] = useState<Record<string, boolean>>({});
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const { leaderboard } = await res.json();
        const sortedLeaderboard = leaderboard.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
        setLeaderboard(sortedLeaderboard);
        localStorage.setItem("leaderboard", JSON.stringify(sortedLeaderboard));
      } catch (err) {
        const cachedLeaderboard = localStorage.getItem("leaderboard");
        if (cachedLeaderboard) {
          setLeaderboard(JSON.parse(cachedLeaderboard));
        }
      }
    };
    fetchLeaderboard();
    const intervalId = setInterval(fetchLeaderboard, 20000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const likedUsersStr = localStorage.getItem("likedUsers");
    if (likedUsersStr) {
      const parsedLikedUsers = JSON.parse(likedUsersStr) as Record<string, boolean>;
      setLikedUsers((likedUsers) => ({
        ...likedUsers,
        ...parsedLikedUsers,
      }));      
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("likedUsers", JSON.stringify(likedUsers));
  }, [likedUsers]);  

  const toggleLikedUser = (username: string) => {
    const newLikedUsers = {
      ...likedUsers,
      [username]: !likedUsers[username],
    };
    setLikedUsers(newLikedUsers);
    localStorage.setItem("likedUsers", JSON.stringify(newLikedUsers));
  };
  

  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
  };

  return (
    <div className="isolate bg-white">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
      >
        <svg
          className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
          viewBox="0 0 1500 678"
        >
          <path
            fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
            fillOpacity=".3"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
              x1="926.62"
              x2="-102.215"
              y1=".831"
              y2="85."
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9089FC" />
              <stop offset={1} stopColor="#FF80B5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className={styles.container}>
        <div className={styles.leaderboard}>
          <ul className={styles.list} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <li className={`${styles.listItem} ${styles.headerItem}`}>
              <span className={styles.headerNumber}>#</span>
              <span className={styles.headerName}>name</span>
              <span className={styles.headerScore}>score</span>
            </li>
            {leaderboard.map(({ username, profileImage, score }, index) => (
              <LeaderboardItem
                key={`${username}-${index}-${likedUsers[username]}`}
                entry={{ username, profileImage, liked: likedUsers[username], score }}
                index={index}
                toggleLikedUser={toggleLikedUser}
                style={
                  mousePosition
                    ? {
                        boxShadow: `${mousePosition.x}px ${mousePosition.y}px 10px rgba(0, 0, 0, 0.2)`,
                      }
                    : {}
                }
              />
            ))}
          </ul>
        </div>
        <div className={styles.boxShadow} style={{ left: 0, top: 0 }} />
      </div>
    </div>
  );
};

export default Leaderboard;
