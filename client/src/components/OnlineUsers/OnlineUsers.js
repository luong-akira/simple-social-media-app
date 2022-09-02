import React, { useEffect, useContext, useState } from 'react';
import { socketContext } from '../../context/socket';
import IndividualOnlineUser from '../IndividualOnlineUser/IndividualOnlineUser';
import './onlineUsers.css';

const OnlineUsers = ({ myFollowings, user }) => {
  const socket = useContext(socketContext);
  const [onlUsers, setOnlUsers] = useState([]);

  useEffect(() => {
    socket.on('onlineUsers', (data) => {
      let onlineUserExceptMe = data
        .map((e) => e.userId)
        .filter((e) => e !== user._id);
      setOnlUsers(onlineUserExceptMe);
    });
    return () => socket.close;
  }, [socket, user]);

  return (
    <div>
      <div>Sponsored</div>
      <hr />
      <div>Contacts</div>
      {myFollowings.map((myfollowing, index) => (
        <IndividualOnlineUser
          key={index}
          myfollowing={myfollowing}
          onlUsers={onlUsers}
        />
      ))}
    </div>
  );
};

export default OnlineUsers;
