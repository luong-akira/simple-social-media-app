import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const IndividualConversation = ({ conversation, userId, onlUsers }) => {
  const [user, setUser] = useState({});
  const otherId = conversation.members.filter((m) => m !== userId);

  useEffect(() => {
    axios.get(`/api/users/${otherId}`).then((res) => setUser(res.data));
  }, []);
  return (
    <Link
      to={`/message/${user._id}`}
      style={{ textDecoration: 'none', color: 'black' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid gray',
          borderRadius: '10px',
          margin: '10px',
          padding: '8px',
        }}
      >
        <div style={{ flex: '2', position: 'relative' }}>
          <img
            src={user.profilePicture}
            alt=''
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
          {user && onlUsers.includes(otherId[0]) && (
            <span
              className='dot'
              style={{ position: 'absolute', left: '0' }}
            ></span>
          )}
        </div>
        <div style={{ flex: '10' }}>{user.username}</div>
      </div>
    </Link>
  );
};

export default IndividualConversation;
