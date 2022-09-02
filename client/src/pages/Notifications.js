import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar/Navbar';
import axios from 'axios';
import IndividualUser from '../components/IndividualUser/IndividualUser';

const Notifications = () => {
  const [followersNotifs, setFollowersNotif] = useState([]);
  const [postNotifs, setPostNotifs] = useState([]);
  useEffect(() => {
    const config = {
      headers: {
        'x-auth-token': Cookies.get('token'),
      },
    };
    const getData = async () => {
      try {
        await axios.get(`/api/notification/followers`, config);
        const { data } = await axios.get(`/api/notification/post`, config);
        setFollowersNotif(data.followersNotif);
        setPostNotifs(data.postNotif);
      } catch (error) {}
    };
    getData();
  }, []);
  return (
    <div>
      <Navbar />

      <div className='dashboardWrapper'>
        <div className='dashboardRightbar'></div>
        <div
          style={{
            flex: '5',
          }}
        >
          {' '}
          {followersNotifs.length !== 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid gray',
                borderRadius: '5px',
                marginTop: '10px',
                flexWrap: 'wrap',
              }}
            >
              {followersNotifs.map((user) => (
                <IndividualUser user={user} />
              ))}
              <p>is following you</p>
            </div>
          )}
        </div>
        <div className='dashboardSideBar'></div>
      </div>
    </div>
  );
};

export default Notifications;
