import { Art, Button } from '../components/ui';

export default function NotFound() {
  return (
    <section className="container section not-found">
      <Art name="lattice-dark" ratio="21 / 9" />
      <h1>Page not found.</h1>
      <p className="lead">The page you’re looking for drifted off the grid.</p>
      <div className="hero-actions center">
        <Button to="/">Back home</Button>
      </div>
    </section>
  );
}
