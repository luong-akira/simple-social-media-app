import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const IndividualUser = ({ user }) => {
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    axios.get(`/api/users/${user}`).then((res) => setUserInfo(res.data));
  }, [user]);
  return (
    <div className='mr-2 ml-2'>
      <Link to={`/profile/${userInfo._id}`}>
        <img
          src={userInfo.profilePicture}
          alt=''
          style={{ width: '40px', height: '40px' }}
        />
        <p>{userInfo.username}</p>
      </Link>
    </div>
  );
};

export default IndividualUser;
