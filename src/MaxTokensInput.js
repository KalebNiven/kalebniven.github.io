import React, { useState } from 'react';

function MaxTokensInput(maxTokens, setMaxTokens) {
  

  return (
    <div>
      <label>
        Max Tokens (OpenAI)
        <input
          type="number"
          id="maxTokens"
          name="maxTokens"
          min="1"
          max="2048"
          value={maxTokens}
          onChange={(e) => setMaxTokens(e.target.value)}
        />
      </label>
    </div>
  );
}

export default MaxTokensInput;
