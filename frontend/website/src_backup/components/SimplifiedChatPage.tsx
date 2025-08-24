import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { useParentContext } from '../contexts/ParentContext';
import { 
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Clock,
  CheckCircle,
  FileText,
  Star,
  MessageCircle,
  Heart
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'reach' | 'system';
  content: string;
  timestamp: Date;
  type: 'text' | 'form' | 'system';
  formData?: FormData;
  status?: 'sent' | 'delivered' | 'read';
}

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'rating';
  label: string;
  labelZh: string;
  required: boolean;
  options?: Array<{ value: string; label: string; labelZh: string }>;
  placeholder?: string;
  placeholderZh?: string;
}

interface FormData {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  fields: FormField[];
  responses?: { [fieldId: string]: any };
  submitted: boolean;
  dueDate?: Date;
}

export function SimplifiedChatPage() {
  const { state, t } = useParentContext();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'reach',
      content: state.language === 'zh' 
        ? `您好 ${state.user.name}！我是REACH支援團隊。有什麼可以幫助您的嗎？` 
        : `Hello ${state.user.name}! I'm from the REACH support team. How can I help you today?`,
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      status: 'read',
    },
    {
      id: '2',
      sender: 'system',
      content: state.language === 'zh' ? '新的每週反饋表單可用' : 'New weekly feedback form available',
      timestamp: new Date(Date.now() - 1800000),
      type: 'form',
      formData: {
        id: 'weekly-feedback',
        title: 'Weekly Learning Feedback',
        titleZh: '每週學習反饋',
        description: 'Please share your thoughts about this week\'s activities and your child\'s progress',
        descriptionZh: '請分享您對本週活動和孩子進展的想法',
        fields: [
          {
            id: 'satisfaction',
            type: 'rating',
            label: 'How satisfied are you with this week\'s activities?',
            labelZh: '您對本週的活動滿意度如何？',
            required: true,
          },
          {
            id: 'child-engagement',
            type: 'radio',
            label: 'How engaged was your child with the assignments?',
            labelZh: '您的孩子對作業的參與度如何？',
            required: true,
            options: [
              { value: 'very-engaged', label: 'Very engaged', labelZh: '非常積極' },
              { value: 'somewhat-engaged', label: 'Somewhat engaged', labelZh: '比較積極' },
              { value: 'not-engaged', label: 'Not very engaged', labelZh: '不太積極' },
            ],
          },
          {
            id: 'improvements',
            type: 'textarea',
            label: 'What areas would you like to see improved?',
            labelZh: '您希望在哪些方面有所改進？',
            required: false,
            placeholder: 'Please share your suggestions...',
            placeholderZh: '請分享您的建議...',
          },
        ],
        submitted: false,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sent',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          state.language === 'zh' 
            ? '謝謝您的消息。我們會盡快回覆您！' 
            : 'Thank you for your message. We\'ll get back to you shortly!',
          state.language === 'zh'
            ? '我們已收到您的查詢，老師會在24小時內回覆。'
            : 'We\'ve received your inquiry. A teacher will respond within 24 hours.',
          state.language === 'zh'
            ? '如果您需要緊急協助，請直接致電我們的熱線。'
            : 'If you need urgent assistance, please call our hotline directly.'
        ];
        
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'reach',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: 'text',
          status: 'delivered',
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }, 500);
  };

  const submitForm = (formData: FormData, responses: { [fieldId: string]: any }) => {
    const updatedMessages = messages.map(msg => {
      if (msg.formData?.id === formData.id) {
        return {
          ...msg,
          formData: {
            ...msg.formData,
            responses,
            submitted: true,
          },
        };
      }
      return msg;
    });

    setMessages(updatedMessages);

    // Add confirmation message
    const confirmationMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'system',
      content: state.language === 'zh' 
        ? '表單提交成功！感謝您的反饋。' 
        : 'Form submitted successfully! Thank you for your feedback.',
      timestamp: new Date(),
      type: 'system',
      status: 'delivered',
    };

    setTimeout(() => {
      setMessages(prev => [...prev, confirmationMessage]);
    }, 500);
  };

  const RatingField = ({ field, value, onChange }: { field: FormField; value: number; onChange: (value: number) => void }) => (
    <div className="space-y-2">
      <Label className="text-sm">
        {state.language === 'zh' ? field.labelZh : field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`p-1 rounded transition-colors ${
              rating <= value 
                ? 'text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        {value > 0 && `${value}/5 stars`}
      </p>
    </div>
  );

  const FormMessage = ({ formData }: { formData: FormData }) => {
    const [responses, setResponses] = useState<{ [fieldId: string]: any }>(formData.responses || {});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFieldChange = (fieldId: string, value: any) => {
      setResponses(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleSubmit = async () => {
      setIsSubmitting(true);
      
      // Validate required fields
      const requiredFields = formData.fields.filter(f => f.required);
      const missingFields = requiredFields.filter(f => !responses[f.id]);
      
      if (missingFields.length > 0) {
        alert(t('form.missingRequired', 'Please fill in all required fields'));
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      submitForm(formData, responses);
      setIsSubmitting(false);
    };

    if (formData.submitted) {
      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h4 className="text-emerald-800">
              {t('form.submitted', 'Form Submitted')}
            </h4>
          </div>
          <p className="text-sm text-emerald-700">
            {t('form.thankYou', 'Thank you for your feedback!')}
          </p>
        </div>
      );
    }

    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-blue-800">
                {state.language === 'zh' ? formData.titleZh : formData.title}
              </CardTitle>
            </div>
            {formData.dueDate && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Due {formData.dueDate.toLocaleDateString()}
              </Badge>
            )}
          </div>
          <p className="text-sm text-blue-700">
            {state.language === 'zh' ? formData.descriptionZh : formData.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.fields.map((field) => (
            <div key={field.id}>
              {field.type === 'text' && (
                <div className="space-y-2">
                  <Label className="text-sm">
                    {state.language === 'zh' ? field.labelZh : field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    value={responses[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={state.language === 'zh' ? field.placeholderZh : field.placeholder}
                  />
                </div>
              )}

              {field.type === 'textarea' && (
                <div className="space-y-2">
                  <Label className="text-sm">
                    {state.language === 'zh' ? field.labelZh : field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Textarea
                    value={responses[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={state.language === 'zh' ? field.placeholderZh : field.placeholder}
                    rows={3}
                  />
                </div>
              )}

              {field.type === 'radio' && (
                <div className="space-y-2">
                  <Label className="text-sm">
                    {state.language === 'zh' ? field.labelZh : field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <RadioGroup 
                    value={responses[field.id] || ''} 
                    onValueChange={(value) => handleFieldChange(field.id, value)}
                  >
                    {field.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="text-sm">
                          {state.language === 'zh' ? option.labelZh : option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {field.type === 'rating' && (
                <RatingField
                  field={field}
                  value={responses[field.id] || 0}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
              )}
            </div>
          ))}

          <div className="pt-4">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  {t('form.submitting', 'Submitting...')}
                </>
              ) : (
                t('form.submit', 'Submit')
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';

    if (message.type === 'form' && message.formData) {
      return (
        <div className="mb-4">
          <FormMessage formData={message.formData} />
        </div>
      );
    }

    return (
      <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[80%] p-3 rounded-2xl ${
            isSystem
              ? 'bg-amber-100 border border-amber-200 text-amber-800'
              : isUser
              ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white'
              : 'bg-white shadow-md text-gray-900 border border-gray-100'
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <div className={`flex items-center justify-between mt-2 text-xs ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {isUser && message.status === 'read' && (
              <CheckCircle className="w-3 h-3" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-25 to-emerald-25 flex flex-col" style={{
      background: 'linear-gradient(to bottom, #f0f9ff, #ecfdf5)'
    }}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-sky-400 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-medium">REACH Support</h3>
              <div className="text-sm text-emerald-600 flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                {t('chat.online', 'Online')}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Video className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-white shadow-md rounded-2xl p-3 border border-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Paperclip className="w-4 h-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('chat.typeMessage', 'Type a message...')}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="pr-12 rounded-full border-gray-300 bg-gray-50"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            onClick={sendMessage} 
            className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}