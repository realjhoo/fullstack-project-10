// gtg
import React from "react";

export default (props) => {
  const { cancel, errors, submit, submitButtonText, elements } = props;

  // ========================================================
  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  // ====================================================
  function handleCancel(event) {
    event.preventDefault();
    cancel();
  }

  // ===================================================
  return (
    <div>
      <ErrorsDisplay errors={errors} />
      <form onSubmit={handleSubmit}>
        {elements()}
        <div className="grid-100 pad-bottom">
          <button className="button" type="submit">
            {submitButtonText}
          </button>
          <button className="button button-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// ========================================================
// if there are errors, format them and show
function ErrorsDisplay({ errors }) {
  let errorsDisplay = null;
  errors = Object.values(errors);

  if (errors.length) {
    errorsDisplay = (
      <div>
        <h2 className="validation--errors--label">Validation Errors!</h2>
        <div className="validation-errors">
          <ul>
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return errorsDisplay;
}
