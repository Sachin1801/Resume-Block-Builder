<template>
  <el-dialog
    v-model="visible"
    title="Report a Bug"
    width="600px"
    :before-close="handleClose"
    :append-to-body="true"
    :modal-class="'bug-report-modal'"
  >
    <el-form :model="bugReport" :rules="rules" ref="bugReportForm" label-width="120px">
      <el-form-item label="Your Email" prop="email">
        <el-input
          v-model="bugReport.email"
          placeholder="Enter your email address"
          type="email"
        />
      </el-form-item>
      
      <el-form-item label="Bug Title" prop="title">
        <el-input
          v-model="bugReport.title"
          placeholder="Brief description of the bug"
        />
      </el-form-item>
      
      <el-form-item label="Description" prop="description">
        <el-input
          v-model="bugReport.description"
          type="textarea"
          :rows="6"
          placeholder="Please describe the bug in detail. Include steps to reproduce if possible."
        />
      </el-form-item>
      
      <el-form-item label="Priority" prop="priority">
        <el-select v-model="bugReport.priority" placeholder="Select priority">
          <el-option label="Low" value="low" />
          <el-option label="Medium" value="medium" />
          <el-option label="High" value="high" />
          <el-option label="Critical" value="critical" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="Browser" prop="browser">
        <el-input
          v-model="bugReport.browser"
          placeholder="e.g., Chrome 120, Firefox 121"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="submitBugReport" :loading="submitting">
          Submit Report
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus';
import emailjs from '@emailjs/browser';

export default {
  name: 'BugReportModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      submitting: false,
      bugReport: {
        email: '',
        title: '',
        description: '',
        priority: 'medium',
        browser: ''
      },
      rules: {
        email: [
          { required: true, message: 'Please enter your email', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
        ],
        title: [
          { required: true, message: 'Please enter a bug title', trigger: 'blur' },
          { min: 5, message: 'Title should be at least 5 characters', trigger: 'blur' }
        ],
        description: [
          { required: true, message: 'Please describe the bug', trigger: 'blur' },
          { min: 20, message: 'Description should be at least 20 characters', trigger: 'blur' }
        ],
        priority: [
          { required: true, message: 'Please select priority', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    visible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  mounted() {
    // Initialize EmailJS with your public key
    // These credentials are safe to expose - they're meant to be public
    const publicKey = process.env.VUE_APP_EMAILJS_PUBLIC_KEY || "TlI8Cci_L9xD_2lKX";
    emailjs.init(publicKey);
    
    // Auto-detect browser info
    this.bugReport.browser = this.getBrowserInfo();
  },
  methods: {
    getBrowserInfo() {
      const ua = navigator.userAgent;
      let browserName = 'Unknown';
      let browserVersion = '';
      
      if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
        browserName = 'Chrome';
        browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || '';
      } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
        browserName = 'Safari';
        browserVersion = ua.match(/Version\/(\d+)/)?.[1] || '';
      } else if (ua.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
        browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || '';
      } else if (ua.indexOf('Edg') > -1) {
        browserName = 'Edge';
        browserVersion = ua.match(/Edg\/(\d+)/)?.[1] || '';
      }
      
      return browserVersion ? `${browserName} ${browserVersion}` : browserName;
    },
    handleClose() {
      this.$refs.bugReportForm.resetFields();
      this.visible = false;
    },
    async submitBugReport() {
      this.$refs.bugReportForm.validate(async (valid) => {
        if (valid) {
          this.submitting = true;
          try {
            // Generate ticket ID
            const ticketId = 'BUG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
            
            // Prepare EmailJS template parameters matching the template in docs
            const templateParams = {
              // Core template variables
              ticket_id: ticketId,
              timestamp: new Date().toLocaleString(),
              priority: this.bugReport.priority,
              
              // Bug details
              bug_title: this.bugReport.title,
              bug_description: this.bugReport.description,
              
              // User information
              from_email: this.bugReport.email,
              browser: this.bugReport.browser,
              url: window.location.href,
              
              // Reply configuration
              reply_to: this.bugReport.email
            };
            
            // Send via EmailJS (using env vars with fallback to hardcoded values)
            const serviceId = process.env.VUE_APP_EMAILJS_SERVICE_ID || 'service_1jjbnh7';
            const templateId = process.env.VUE_APP_EMAILJS_TEMPLATE_ID || 'template_sokt6dy';
            
            const response = await emailjs.send(
              serviceId,
              templateId,
              templateParams
            );
            
            if (response.status === 200) {
              // Save to localStorage for reference
              const reports = JSON.parse(localStorage.getItem('bugReports') || '[]');
              reports.push({
                ...this.bugReport,
                ticketId,
                timestamp: new Date().toISOString(),
                status: 'sent'
              });
              localStorage.setItem('bugReports', JSON.stringify(reports));
              
              // Show success message
              ElMessage.success({
                message: `Bug report successfully sent! Your ticket ID is: ${ticketId}`,
                duration: 5000,
                showClose: true
              });
              
              // Close modal
              this.handleClose();
            } else {
              throw new Error('EmailJS returned non-200 status');
            }
            
          } catch (error) {
            console.error('Error submitting bug report:', error);
            
            // Show error with instructions
            ElMessage.error({
              message: 'Failed to send bug report. Please check your internet connection and try again.',
              duration: 5000,
              showClose: true
            });
            
            // Log error details for debugging
            console.error('EmailJS Error Details:', {
              error: error.message,
              text: error.text,
              status: error.status
            });
          } finally {
            this.submitting = false;
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

:deep(.el-dialog__header) {
  background: var(--header-bg, #f5f5f5);
  padding: 20px;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: bold;
}
</style>