import { useRouter } from "next/router";
import NewMeetForm from "../../components/meetups/NewMeetupForm";
import { Fragment } from "react";
import Head from "next/head";
// our-domain/new-meetup

function NewMeetupPage() {
  const router = useRouter();

  async function addMeetupHandler(meetup) {
    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(meetup),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log(data);

    router.push("/");
  }

  return (
    <Fragment>
      <Head>
        <title>Add a New Meetup</title>
        <meta
          name="description"
          content="Add your own meetups and create amazing networking oportunities"
        ></meta>
      </Head>
      <NewMeetForm onAddMeetup={addMeetupHandler} />
    </Fragment>
  );
}

export default NewMeetupPage;
