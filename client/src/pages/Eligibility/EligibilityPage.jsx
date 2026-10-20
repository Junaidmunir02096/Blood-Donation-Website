import { useState } from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle';
import '../shared/InfoPage.scss';

const EligibilityPage = () => {
  usePageTitle('Donation Eligibility');
  const [answers, setAnswers] = useState({ age: '', weight: '', last: '', well: '' });
  const [result, setResult] = useState(null);

  const onChange = (e) => setAnswers((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (answers.age === 'no' || answers.weight === 'no') {
      setResult({
        title: 'You may not be eligible right now',
        body: 'Typical whole-blood donation in Pakistan requires being about 18–65 years old and at least 50 kg. Please speak with a doctor or a licensed blood bank.',
      });
      return;
    }
    if (answers.well === 'no') {
      setResult({
        title: 'Please wait until you feel well',
        body: 'If you have a fever, infection, or were recently unwell, delay donation and seek medical advice.',
      });
      return;
    }
    if (answers.last === 'recent') {
      setResult({
        title: 'Wait before the next whole-blood donation',
        body: 'A common gap is 12 weeks (about 3 months) between whole-blood donations. Plasma or platelets may have different intervals — confirm with the blood bank.',
      });
      return;
    }
    setResult({
      title: 'You may be eligible to register',
      body: 'This quiz is educational only. Final screening is always done by trained staff before any donation.',
    });
  };

  return (
    <div className="info-page">
      <div className="container">
        <h1 className="info-page__title">Donation eligibility checker</h1>
        <p className="info-page__lead">
          Answer a few questions based on common WHO-style donor criteria. This is not a medical diagnosis.
        </p>
        <div className="info-page__card">
          <form className="info-page__form" onSubmit={onSubmit}>
            <div>
              <label className="info-page__label" htmlFor="elig-age">Are you 18–65 years old?</label>
              <select id="elig-age" name="age" className="info-page__select" value={answers.age} onChange={onChange} required>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="info-page__label" htmlFor="elig-weight">Do you weigh at least 50 kg?</label>
              <select id="elig-weight" name="weight" className="info-page__select" value={answers.weight} onChange={onChange} required>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="info-page__label" htmlFor="elig-last">Last whole-blood donation</label>
              <select id="elig-last" name="last" className="info-page__select" value={answers.last} onChange={onChange} required>
                <option value="">Select</option>
                <option value="never">Never donated / more than 12 weeks ago</option>
                <option value="recent">Within the last 12 weeks</option>
              </select>
            </div>
            <div>
              <label className="info-page__label" htmlFor="elig-well">Do you feel well today (no fever or acute illness)?</label>
              <select id="elig-well" name="well" className="info-page__select" value={answers.well} onChange={onChange} required>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <button type="submit" className="info-page__btn">See result</button>
          </form>
          {result && (
            <div className="info-page__result" role="status">
              <strong>{result.title}</strong>
              <p>{result.body}</p>
              <p><Link to="/donate">Register as a donor</Link> · <Link to="/faq">Read FAQ</Link></p>
            </div>
          )}
          <p className="info-page__disclaimer">
            LifeStream is a coordination demo. Licensed blood banks perform haemoglobin tests, health history, and other screening before any donation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EligibilityPage;
