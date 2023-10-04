import React, { useState } from 'react';

function MaxTokensInput({ maxTokens, setMaxTokens }) {

  return (
    <>
      <label htmlFor='maxTokens' className='form-label'>
        Max Tokens (OpenAI)
      </label>
      <input
        className='form-control'
        type="number"
        id="maxTokens"
        name="maxTokens"
        min="1"
        max="2048"
        value={maxTokens}
        onChange={(e) => setMaxTokens(e.target.value)}
      />
    </>
  );
}

export default MaxTokensInput;
