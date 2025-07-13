import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Award,
  Globe,
  Heart,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "./About.scss";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <Badge variant="outline" className="hero-badge">
                <Sparkles className="badge-icon" />
                {t("about.established")}
              </Badge>
              <h1 className="hero-title">{t("about.empoweringFashion")}</h1>
              <p className="hero-description">{t("about.heroDescription")}</p>
              <div className="hero-buttons">
                <Button size="lg" className="btn-primary">
                  {t("hero.shopNow")}
                  <ArrowRight className="btn-icon" />
                </Button>
                <Button variant="outline" size="lg" className="btn-secondary">
                  {t("about.ourStory")}
                </Button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image">
                <div className="hero-icon">
                  <Heart className="heart-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-content">
            <div className="mission-text">
              <Badge variant="outline" className="mission-badge">
                <Target className="badge-icon" />
                {t("about.ourMission")}
              </Badge>
              <h2 className="mission-title">{t("about.missionTitle")}</h2>
              <p className="mission-description">
                {t("about.missionDescription")}
              </p>
              <Button className="mission-btn">
                {t("about.learnMore")}
                <ArrowRight className="btn-icon" />
              </Button>
            </div>
            <div className="mission-images">
              <div className="image-grid">
                <div className="image-box image-1"></div>
                <div className="image-box image-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-header">
            <Badge variant="outline" className="story-badge">
              <Award className="badge-icon" />
              {t("about.established")} 2024
            </Badge>
            <h2 className="story-title">ostaeasy was founded in 2024</h2>
            <p className="story-subtitle">
              By a team of fashion enthusiasts with a passion for timeless style
              and sustainable practices.
            </p>
          </div>

          <div className="story-content">
            <Card className="story-card">
              <CardContent className="story-card-content">
                <div className="story-icon">
                  <Users className="icon" />
                </div>
                <h3 className="story-card-title">{t("about.qualityFirst")}</h3>
                <p className="story-card-text">
                  {t("about.qualityDescription")}
                </p>
                <Separator className="story-separator" />
                <div className="story-stats">
                  <div className="stat">
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">Happy Customers</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Products</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="story-images">
              <div className="story-main-image"></div>
              <div className="story-small-images">
                <div className="small-image small-1"></div>
                <div className="small-image small-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <div className="values-header">
            <Badge variant="outline" className="values-badge">
              <Heart className="badge-icon" />
              {t("about.ourValues")}
            </Badge>
            <h2 className="values-title">{t("about.whyChooseUs")}</h2>
            <p className="values-subtitle">
              Our core values guide everything we do, from product selection to
              customer service.
            </p>
          </div>

          <div className="values-grid">
            {[
              {
                icon: Shield,
                title: t("about.qualityFirst"),
                description: t("about.qualityDescription"),
                colorClass: "blue-gradient",
              },
              {
                icon: Star,
                title: t("about.fastShipping"),
                description: t("about.fastShippingDescription"),
                colorClass: "purple-gradient",
              },
              {
                icon: Globe,
                title: t("about.customerSupport"),
                description: t("about.customerSupportDescription"),
                colorClass: "green-gradient",
              },
              {
                icon: TrendingUp,
                title: t("about.sustainability"),
                description: t("about.sustainabilityDescription"),
                colorClass: "orange-gradient",
              },
            ].map((value, index) => (
              <Card key={index} className="value-card">
                <CardContent className="value-card-content">
                  <div className={`value-icon ${value.colorClass}`}>
                    <value.icon className="icon" />
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="reviews-section">
        <div className="reviews-container">
          <div className="reviews-header">
            <Badge variant="outline" className="reviews-badge">
              <Star className="badge-icon star-filled" />
              Customer Reviews
            </Badge>
            <h2 className="reviews-title">What Our Customers Say</h2>
            <p className="reviews-subtitle">
              Real stories from real customers who love shopping with us.
            </p>
          </div>

          <div className="reviews-grid">
            {[
              {
                name: "Robert Smith",
                review:
                  "I have been shopping with this web fashion site for over a year now and I can confidently say it is the best online fashion site out there. The shipping is always fast and the customer service team is friendly and helpful.",
                rating: 5,
                avatar: "RS",
              },
              {
                name: "Jennifer Unix",
                review:
                  "Amazing quality and style! Every piece I've purchased has exceeded my expectations. The fit is perfect and the materials are top-notch.",
                rating: 5,
                avatar: "JU",
              },
              {
                name: "Michael Chen",
                review:
                  "Outstanding customer service and beautiful products. I love how inclusive and sustainable their approach is. Highly recommend!",
                rating: 5,
                avatar: "MC",
              },
            ].map((review, index) => (
              <Card key={index} className="review-card">
                <CardContent className="review-content">
                  <div className="review-stars">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="star star-filled" />
                    ))}
                  </div>
                  <p className="review-text">"{review.review}"</p>
                  <div className="review-author">
                    <div className="author-avatar">
                      <span>{review.avatar}</span>
                    </div>
                    <div className="author-info">
                      <div className="author-name">{review.name}</div>
                      <div className="author-label">Verified Customer</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Transform Your Style?</h2>
          <p className="cta-description">
            Join thousands of satisfied customers who have discovered their
            perfect style with ostaeasy.
          </p>
          <div className="cta-buttons">
            <Button size="lg" variant="secondary" className="cta-btn-primary">
              Shop Collection
              <ArrowRight className="btn-icon" />
            </Button>
            <Button size="lg" variant="outline" className="cta-btn-secondary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
