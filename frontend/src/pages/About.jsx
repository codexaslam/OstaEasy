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

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-gray-50 opacity-30"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge
                variant="outline"
                className="mb-6 bg-white/50 border-blue-200 backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                Est. 2024
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Fashion
                </span>{" "}
                With Style
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We are AA Webshop - your destination for timeless style and
                modern fashion. Where quality meets affordability, and every
                piece tells a story.
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-lg"
                >
                  Shop Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 px-8 py-6 text-lg font-semibold"
                >
                  Our Story
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="h-24 w-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="bg-red-50 border-red-200">
                <Target className="h-4 w-4 mr-2 text-red-600" />
                Our Mission
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Our mission is to empower people through sustainable fashion
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We want everyone to look and feel good, while also doing our
                part to help the environment. We believe that fashion should be
                stylish, affordable and accessible to everyone. Body positivity
                and inclusivity are values that are at the heart of our brand.
              </p>
              <div className="flex gap-4 pt-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl"></div>
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl mt-8"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-white border-gray-200">
              <Award className="h-4 w-4 mr-2 text-yellow-600" />
              Established 2024
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AA Webshop was founded in 2024
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              By a team of fashion enthusiasts with a passion for timeless style
              and sustainable practices.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 p-8">
              <CardContent className="space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Quality is our priority
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our talented stylists have put together outfits that are
                  perfect for the season. They've created a variety of ways to
                  inspire your next fashion-forward look.
                </p>
                <Separator className="my-6" />
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      10K+
                    </div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      500+
                    </div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-xl"></div>
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
            >
              <Heart className="h-4 w-4 mr-2 text-blue-600" />
              Our Values
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What We Stand For
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values guide everything we do, from product selection to
              customer service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "High-Quality Materials",
                description:
                  "Crafted with precision and excellence, our products are meticulously engineered using premium materials.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Star,
                title: "Laconic Design",
                description:
                  "Simplicity refined. Our products embody the essence of minimalistic design, delivering effortless style.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Globe,
                title: "Various Sizes",
                description:
                  "Designed for every body and anyone, our collection embraces diversity with a wide range of sizes.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: TrendingUp,
                title: "Sustainable Fashion",
                description:
                  "We're committed to sustainable practices and ethical manufacturing for a better tomorrow.",
                color: "from-orange-500 to-red-500",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${value.color} rounded-full flex items-center justify-center`}
                  >
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 bg-white/50 border-purple-200 backdrop-blur-sm"
            >
              <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
              Customer Reviews
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real customers who love shopping with us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed italic">
                    "{review.review}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {review.avatar}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {review.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Verified Customer
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Style?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered their
            perfect style with AA Webshop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
            >
              Shop Collection
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
