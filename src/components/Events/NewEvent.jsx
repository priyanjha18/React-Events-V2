import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query"
import { createNewEvent } from '../../util/http.js';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { queryClient } from '../../util/http.js';

export default function NewEvent() {
  const navigate = useNavigate();


  function handleSubmit(formData) {
    mutate({event:formData})

  }
  const {mutate,isPending,isError,error}=useMutation({
    mutationFn:createNewEvent,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["events"]});
      navigate("/events")
    }
  });

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && <p>submitting data...</p>}
       {!isPending &&  <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>}
      </EventForm>
      {isError && error && <ErrorBlock title="an error occured" message={error.info?.message || "failed to create event,Please check your input and try again"}></ErrorBlock>}
    </Modal>
  );
}
