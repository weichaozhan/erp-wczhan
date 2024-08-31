import aboutstyle from './styles/about.module.scss';

function About() {
  return (
    <div className={aboutstyle.about} id={aboutstyle.about}>
      About
      <p className={aboutstyle.desc}>
        desc
      </p>
    </div>
  )
}

export default About