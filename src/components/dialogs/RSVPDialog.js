// Libraries
import React from "react";
import {
  Button,
  Text,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

// Other
import firebase from "src/firebase";

// Constants
import { EVENT_RESPONSES } from "src/constants/eventResponse";
import { COLLECTIONS } from "src/constants/firebase";

// Providers
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////
// RSVPDialog

const RSVPDialog = (props) => {
  const { authUser } = useAuth();
  const toast = useToast();
  const cancelRef = React.useRef();
  const attendRef = React.useRef();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const hasResponded = React.useMemo(() => Boolean(props.eventResponse), [
    props.eventResponse,
  ]);

  const onAttendingAlertConfirm = async (response) => {
    setIsSubmitting(true);

    const data = getResponseFormData(response);

    if (!hasResponded) {
      firebase
        .firestore()
        .collection(COLLECTIONS.EVENT_RESPONSES)
        .add(data)
        .then(() => {
          props.onClose();
          setIsSubmitting(false);
          toast({
            title: "RSVP created.",
            description: "Your RSVP has been created.",
            status: "success",
            isClosable: true,
          });
          window.location.reload();
        })
        .catch((error) => {
          props.onClose();
          setIsSubmitting(false);
          toast({
            title: "An error occurred.",
            description: error.message,
            status: "error",
            isClosable: true,
          });
        });
    } else {
      firebase
        .firestore()
        .collection(COLLECTIONS.EVENT_RESPONSES)
        .doc(props.eventResponse.id)
        .update({ response })
        .then(() => {
          props.onClose();
          setIsSubmitting(false);
          toast({
            title: "RSVP updated.",
            description: "Your RSVP has been updated.",
            status: "success",
            isClosable: true,
          });
          window.location.reload();
        })
        .catch((error) => {
          props.onClose();
          setIsSubmitting(false);
          toast({
            title: "An error occurred.",
            description: error.message,
            status: "error",
            isClosable: true,
          });
        });
    }
  };

  const getResponseFormData = (response) => {
    const userDocRef = firebase
      .firestore()
      .collection(COLLECTIONS.USERS)
      .doc(authUser.uid);
    const eventDocRef = firebase
      .firestore()
      .collection(COLLECTIONS.EVENTS)
      .doc(props.event.id);
    const schoolDocRef = firebase
      .firestore()
      .collection(COLLECTIONS.SCHOOLS)
      .doc(props.event.school.id);

    const data = {
      response,
      user: {
        id: userDocRef.id,
        ref: userDocRef,
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        gravatar: props.user.gravatar,
        status: props.user.status,
        school: {
          ref: props.user.school.ref,
          id: props.user.school.id,
          name: props.user.school.name,
        },
      },
      event: {
        id: eventDocRef.id,
        ref: eventDocRef,
        name: props.event.name,
        description: props.event.description,
        startDateTime: props.event.startDateTime.firestore,
        endDateTime: props.event.endDateTime,
        isOnlineEvent: props.event.isOnlineEvent,
        responses: {
          yes: 1,
          no: 0,
        },
      },
      school: {
        id: schoolDocRef.id,
        ref: schoolDocRef,
        name: props.event.school.name,
      },
    };

    return data;
  };

  if (
    !hasResponded ||
    (hasResponded && props.eventResponse.response === EVENT_RESPONSES.NO)
  ) {
    return (
      <AlertDialog
        isOpen={props.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={props.onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
          <AlertDialogHeader>RSVP</AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to RSVP for{" "}
            <Text as="span" fontWeight="bold">
              {props.event ? props.event.name : ""}
            </Text>
            ?
          </AlertDialogBody>

          <AlertDialogFooter>
            {isSubmitting ? (
              <Button colorScheme="brand" disabled={true}>
                RSVPing...
              </Button>
            ) : (
              <React.Fragment>
                <Button ref={attendRef} onClick={props.onClose}>
                  No, nevermind
                </Button>
                <Button
                  colorScheme="brand"
                  onClick={() => onAttendingAlertConfirm(EVENT_RESPONSES.YES)}
                  ml={3}
                >
                  Yes, I want to go
                </Button>
              </React.Fragment>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else if (
    hasResponded &&
    props.eventResponse.response === EVENT_RESPONSES.YES
  ) {
    return (
      <AlertDialog
        isOpen={props.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={props.onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
          <AlertDialogHeader>Cancel RSVP</AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to cancel your RSVP for{" "}
            <Text as="span" fontWeight="bold">
              {props.event ? props.event.name : ""}
            </Text>
            ?
          </AlertDialogBody>

          <AlertDialogFooter>
            {props.isSubmitting ? (
              <Button colorScheme="red" disabled={true}>
                Cancelling...
              </Button>
            ) : (
              <React.Fragment>
                <Button ref={cancelRef} onClick={props.onClose}>
                  No, nevermind
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => onAttendingAlertConfirm(EVENT_RESPONSES.NO)}
                  ml={3}
                >
                  Yes, cancel the RSVP
                </Button>
              </React.Fragment>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else {
    return null;
  }
};

export default RSVPDialog;
