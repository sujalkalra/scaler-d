-- Insert sample featured articles data without difficulty field first
INSERT INTO public.articles (title, content, excerpt, tags, company, company_image, is_featured, read_time, published) VALUES
(
  'System Design of Netflix: Streaming at Scale',
  'Netflix serves over 230 million subscribers worldwide, streaming billions of hours of content. This article explores Netflix''s microservices architecture, content delivery network, and recommendation systems that enable seamless streaming at global scale.',
  'Deep dive into Netflix''s microservices architecture, CDN strategy, and real-time recommendation engine that serves 230+ million users globally.',
  ARRAY['Netflix', 'Microservices', 'CDN', 'Streaming', 'Scale'],
  'Netflix',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop&crop=center',
  true,
  12,
  true
),
(
  'YouTube''s Video Processing Pipeline: 500 Hours Per Minute',
  'YouTube processes over 500 hours of video content every minute. Learn how YouTube''s infrastructure handles video encoding, storage, and delivery at unprecedented scale using cloud-native architecture.',
  'Learn how YouTube processes, encodes, and distributes video content at massive scale using cloud infrastructure and intelligent caching.',
  ARRAY['YouTube', 'Video Processing', 'Encoding', 'Cloud', 'Infrastructure'],
  'Google',
  'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=200&fit=crop&crop=center',
  true,
  15,
  true
),
(
  'Spotify''s Real-time Music Recommendation System',
  'Spotify''s recommendation engine processes billions of user interactions to deliver personalized music experiences. This article covers machine learning pipelines, collaborative filtering, and real-time data processing.',
  'Explore Spotify''s machine learning pipelines, collaborative filtering, and real-time data processing for personalized music discovery.',
  ARRAY['Spotify', 'Recommendations', 'ML', 'Real-time', 'Music'],
  'Spotify',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop&crop=center',
  true,
  10,
  true
),
(
  'Uber''s Dispatch System: Matching Riders and Drivers',
  'Uber''s dispatch system handles millions of ride requests daily across 900+ cities. Learn about geospatial indexing, real-time matching algorithms, and dynamic pricing systems.',
  'Understanding Uber''s real-time dispatch system, geospatial algorithms, and dynamic pricing that connects millions of riders with drivers.',
  ARRAY['Uber', 'Dispatch', 'Geospatial', 'Real-time', 'Algorithms'],
  'Uber',
  'https://images.unsplash.com/photo-1569288052389-dac9b0ac9be5?w=400&h=200&fit=crop&crop=center',
  true,
  14,
  true
),
(
  'WhatsApp''s Message Delivery: 100 Billion Messages Daily',
  'WhatsApp handles over 100 billion messages daily with minimal infrastructure. Discover the secrets behind WhatsApp''s efficient message delivery, end-to-end encryption, and global scalability.',
  'Deep dive into WhatsApp''s message delivery architecture, encryption protocols, and scalability strategies for billions of users.',
  ARRAY['WhatsApp', 'Messaging', 'Encryption', 'Scalability', 'Mobile'],
  'Meta',
  'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=400&h=200&fit=crop&crop=center',
  true,
  11,
  true
),
(
  'Amazon''s Recommendation Engine: Personalization at Scale',
  'Amazon''s recommendation system drives 35% of total sales. Learn about collaborative filtering, item-to-item recommendations, and real-time personalization algorithms.',
  'Explore Amazon''s sophisticated recommendation algorithms, personalization strategies, and machine learning systems that drive billions in revenue.',
  ARRAY['Amazon', 'Recommendations', 'E-commerce', 'Personalization', 'ML'],
  'Amazon',
  'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=200&fit=crop&crop=center',
  true,
  13,
  true
);