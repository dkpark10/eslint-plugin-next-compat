// This is a SERVER component that demonstrates composition
// It uses a client wrapper but passes server components as children

import ClientWrapper from './client-wrapper';
import ServerComponent from './server-component';
import ServerWithText from './server-with-text';

export default function CompositionExample() {
  return (
    <div>
      <h1>Composition Pattern Example</h1>

      {/* Client wrapper with server components as children */}
      <ClientWrapper>
        <ServerComponent />
        <ServerWithText />
      </ClientWrapper>
    </div>
  );
}
