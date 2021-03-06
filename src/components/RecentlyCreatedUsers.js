// Libraries
import React from "react";
import { Box, Heading } from "@chakra-ui/react";

// Hooks
import useFetchRecentlyCreatedUsers from "src/hooks/useFetchRecentlyCreatedUsers";

// Components
import UserListItem from "src/components/UserListItem";
import Slider from "src/components/Slider";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";
import EmptyText from "src/components/EmptyText";

////////////////////////////////////////////////////////////////////////////////
// RecentlyCreatedUsers

const RecentlyCreatedUsers = () => {
  const [users, state] = useFetchRecentlyCreatedUsers();
  const hasUsers = React.useMemo(() => Boolean(users) && users.length > 0, [
    users,
  ]);

  return (
    <React.Fragment>
      {state === "idle" || state === "loading" ? (
        <SliderSilhouette />
      ) : (
        <Box as="section" py={4}>
          <Heading as="h3" fontSize="xl" pb={4}>
            Newest users
          </Heading>
          {!(state === "done" && hasUsers) ? (
            <EmptyText>No users have been recently created</EmptyText>
          ) : (
            <Slider
              settings={{
                slidesToShow: 10,
                className: users.length < 10 ? "slick--less-slides" : "",
                responsive: [
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 5,
                    },
                  },
                  {
                    breakpoint: 600,
                    settings: {
                      slidesToShow: 3,
                    },
                  },
                ],
              }}
            >
              {users.map((user) => (
                <UserListItem key={user.id} user={user} />
              ))}
            </Slider>
          )}
        </Box>
      )}
    </React.Fragment>
  );
};

export default RecentlyCreatedUsers;
