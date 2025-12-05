import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Key, Zap, Shield, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const apiFeatures = [
  { icon: Zap, title: 'Fast & Reliable', description: '99.9% uptime with global CDN' },
  { icon: Shield, title: 'Secure', description: 'OAuth 2.0 & API key authentication' },
  { icon: Code, title: 'RESTful', description: 'Clean, intuitive API design' },
  { icon: BookOpen, title: 'Well Documented', description: 'Comprehensive guides and examples' },
];

const endpoints = [
  { method: 'GET', path: '/api/v1/creators', description: 'List all creators' },
  { method: 'GET', path: '/api/v1/creators/:id', description: 'Get creator details' },
  { method: 'POST', path: '/api/v1/campaigns', description: 'Create a campaign' },
  { method: 'GET', path: '/api/v1/analytics', description: 'Get analytics data' },
  { method: 'POST', path: '/api/v1/messages', description: 'Send a message' },
];

const codeExample = `// Example: Fetch creators
const response = await fetch('https://api.viralforge.com/v1/creators', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const creators = await response.json();
console.log(creators);`;

export default function API() {
  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4">Developer API</Badge>
            <h1 className="text-4xl font-bold mb-4">Build with ViralForge</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Integrate creator marketing into your platform with our powerful REST API. Access creators, campaigns, analytics, and more.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">
                <Key className="w-5 h-5 mr-2" />
                Get API Key
              </Button>
              <Button variant="outline" size="lg">
                <BookOpen className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {apiFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Code Example */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript">
                <TabsList>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>
                <TabsContent value="javascript" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{codeExample}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="python" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`import requests

response = requests.get(
    'https://api.viralforge.com/v1/creators',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

creators = response.json()
print(creators)`}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="curl" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`curl -X GET "https://api.viralforge.com/v1/creators" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>Available Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {endpoints.map((endpoint) => (
                  <div
                    key={endpoint.path}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Badge
                      variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                      className="w-16 justify-center"
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="flex-1 text-sm font-mono">{endpoint.path}</code>
                    <span className="text-sm text-muted-foreground hidden sm:block">{endpoint.description}</span>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
