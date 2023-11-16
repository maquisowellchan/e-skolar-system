from djoser.email import ActivationEmail

class CustomActivationEmail(ActivationEmail):
    def get_context_data(self):
        context = super().get_context_data()
        # Add custom data to the email template
        context['custom_data'] = 'Your custom data'
        return context
