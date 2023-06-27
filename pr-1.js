window.currentUser = { id: '19', name: 'Jane', email: 'jane@chameleon.io' };

// users are like authors and profiles like commentors
// open a modal with commentor info when clicked

export const  ActiveProfiles({ profiles, onLaunchProfile }) => {
  var active = [];

  for(i=0; i < profiles.length; i++) {
    if(!profiles[i].disabled && profiles[i]['last_seen_time'] > new Date(new Date().getTime()-(24*60*1000)).toISOString()) { // within the last 24 hours
      active.push(profiles[i]);
    }
  }
  
  if(active.length == 1 && active[0].email  === window.currentUser.email) {
    active.length = 0;
  }

  return (
    <div>
       {active.map(function(a) { return <div onClick={() => onLaunchProfile(a.name, a.email)}>{a.name} - {a.email}</div> })}
    </div>
  )
}

/*
    - fix function declaration (missing = sign after ActiveProfiles)
    - fix Date reduction (24*60*1000) => (24*60*60*1000)
    - use .filter() instead of for loop to filter the active profiles
    - check current user inside filter
    - useMemo hook to save the profiles to prevent unnecessary calculations and rerender
    - use meaningful variable name on map
    - missing key prop inside map
    - use anonymous function and ident the <div> for a better readability
*/

import { useMemo } from "react";

export const NewActiveProfiles = ({ profiles, onLaunchProfile }) => {

    const active = useMemo(() => (
        profiles.filter((profile) => (
            !profile.disabled 
            && profile['last_seen_time'] > new Date(new Date().getTime()-(24*60*60*1000)).toISOString() 
            && profile.email !== window.currentUser.email
        ))
    ), [profiles])
  
    return (
      <div>
            {
                active.map((profile, i) => (
                    <div 
                        key={i} 
                        onClick={() => onLaunchProfile(profile.name, profile.email)}
                    >
                        {profile.name} - {profile.email}
                    </div> 
                ))
            }
      </div>
    )
}